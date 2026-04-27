"""Operational periodic tasks for azurita_project.

Infrastructure tasks scheduled via Huey:
- scheduled_backup: SQLite DB backup weekly (Monday at 03:00 AM UTC)
- silk_garbage_collection: Daily cleanup of Silk data (04:30 AM)
- weekly_slow_queries_report: Thursday 07:00 AM performance report
- silk_reports_cleanup: Monthly cleanup of old Silk reports (1st of month 05:45 AM)
"""

import logging
from datetime import timedelta
from io import StringIO
from pathlib import Path

from django.conf import settings
from django.utils import timezone
from huey import crontab
from huey.contrib.djhuey import periodic_task

logger = logging.getLogger('backups')


@periodic_task(crontab(day_of_week='1', hour='3', minute='0'))
def scheduled_backup():
    """Automated weekly backup of SQLite database (Monday 03:00 UTC)."""
    if not getattr(settings, 'BACKUPS_ENABLED', True):
        logger.info("scheduled_backup skipped: BACKUPS_ENABLED=False")
        return

    from django.core.management import call_command
    timestamp = timezone.now().strftime('%Y-%m-%d_%H%M%S')
    logger.info('=== Starting scheduled backup %s ===', timestamp)
    try:
        output = StringIO()
        call_command('dbbackup', '--compress', '--clean', stdout=output)
        logger.info(output.getvalue())
        logger.info('=== Backup completed successfully ===')
        return True
    except Exception:
        logger.exception('Backup failed')
        raise


@periodic_task(crontab(hour='4', minute='30'))
def silk_garbage_collection():
    """Daily cleanup of Silk profiling data older than 7 days."""
    if not getattr(settings, 'ENABLE_SILK', False):
        return
    from django.core.management import call_command
    output = StringIO()
    call_command('silk_garbage_collect', '--days=7', stdout=output)
    logger.info(output.getvalue())


@periodic_task(crontab(day_of_week='4', hour='7', minute='0'))
def weekly_slow_queries_report():
    """Weekly report of slow queries and potential N+1 patterns."""
    if not getattr(settings, 'ENABLE_SILK', False):
        return
    if not getattr(settings, 'ENABLE_SLOW_QUERIES_REPORT', True):
        logger.info("weekly_slow_queries_report skipped: ENABLE_SLOW_QUERIES_REPORT=False")
        return
    from django.db.models import Count
    try:
        from silk.models import Request, SQLQuery
    except (ImportError, RuntimeError):
        return

    week_ago = timezone.now() - timedelta(days=7)
    threshold_ms = getattr(settings, 'SLOW_QUERY_THRESHOLD_MS', 500)
    n1_threshold = getattr(settings, 'N_PLUS_ONE_THRESHOLD', 10)

    slow = SQLQuery.objects.filter(
        request__start_time__gte=week_ago, time_taken__gte=threshold_ms,
    ).select_related('request').order_by('-time_taken')[:50]
    n1 = Request.objects.filter(
        start_time__gte=week_ago,
    ).annotate(qc=Count('queries')).filter(qc__gte=n1_threshold).order_by('-qc')[:20]

    lines = ['=' * 60, f'WEEKLY QUERY REPORT - {timezone.now():%Y-%m-%d}', '=' * 60, '',
             f'## SLOW QUERIES (>{threshold_ms}ms)', '-' * 40]
    for sq in slow:
        lines.append(f'[{sq.time_taken:.0f}ms] {sq.request.path} - {sq.query[:100]}...')
    if not slow:
        lines.append('No slow queries found this week')
    lines.extend(['', f'## POTENTIAL N+1 (>{n1_threshold} queries/request)', '-' * 40])
    for r in n1:
        lines.append(f'[{r.qc} queries] {r.path}')
    if not n1:
        lines.append('No N+1 patterns detected this week')
    lines.extend(['', '=' * 60])

    reports_dir = Path(settings.BASE_DIR) / 'logs' / 'silk-reports'
    reports_dir.mkdir(parents=True, exist_ok=True)
    (reports_dir / f'silk-report-{timezone.now():%Y-%m-%d}.log').write_text('\n'.join(lines) + '\n')
    logger.info('Weekly report generated. Slow: %d, N+1: %d', slow.count(), n1.count())


@periodic_task(crontab(day='1', hour='5', minute='45'))
def silk_reports_cleanup():
    """Monthly cleanup of Silk report files older than 6 months."""
    if not getattr(settings, 'ENABLE_SILK', False):
        return

    reports_dir = Path(settings.BASE_DIR) / 'logs' / 'silk-reports'
    if not reports_dir.exists():
        return

    cutoff = timezone.now() - timedelta(days=180)
    deleted = 0

    for log_file in reports_dir.glob('silk-report-*.log'):
        if log_file.stat().st_mtime < cutoff.timestamp():
            log_file.unlink()
            deleted += 1

    if deleted:
        logger.info('silk_reports_cleanup: removed %d old reports', deleted)
