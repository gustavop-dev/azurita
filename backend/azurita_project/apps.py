from django.apps import AppConfig


class AzuritaProjectConfig(AppConfig):
    name = 'azurita_project'
    label = 'azurita_ops'

    def ready(self):
        import azurita_project.tasks  # noqa: F401 — Huey periodic task discovery
