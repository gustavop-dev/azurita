"""Root conftest for azurita_project.

Provides shared pytest fixtures.
"""

import pytest
from django.test import Client


@pytest.fixture
def client():
    """Django test client."""
    return Client()
