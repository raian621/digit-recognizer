from fastapi.testclient import TestClient
import pytest

from src.app import app


@pytest.fixture
def client() -> TestClient:
  return TestClient(app)


def test_make_guess(client):
  client.post(
    "/api/make_guess",
    content="",
    headers={"Content-Type": "application/octet-stream"},
  )
