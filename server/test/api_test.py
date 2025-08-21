from fastapi.testclient import TestClient
import pytest
from http import HTTPStatus

from src.app import app
from src.serving import QueuedMessage, GuessResultMessage
from src.containers import Queue


@pytest.fixture
def client() -> TestClient:
  return TestClient(app)


def test_make_invalid_sized_guess(client):
  res = client.post(
    "/api/make_guess",
    content="",
    headers={"Content-Type": "application/octet-stream"},
  )
  assert res.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_make_valid_sized_guess(client):
  data = [0] * 3 * 28 * 28
  res = client.post(
    "/api/make_guess",
    content=bytes(data),
    headers={"Content-Type": "application/octet-stream"},
  )
  assert res.status_code == HTTPStatus.ACCEPTED
  assert len(client.app.state.queue.queue) == 1
  message = QueuedMessage.model_validate_json(res.json())
  assert client.app.state.queue.queue[0][0] == message.guess_id


def test_queue_full_error(client):
  data = [0] * 3 * 28 * 28
  client.app.state.queue = Queue(1)
  res = client.post(
    "/api/make_guess",
    content=bytes(data),
    headers={"Content-Type": "application/octet-stream"},
  )
  assert res.status_code == HTTPStatus.ACCEPTED
  # Queue is full, so the server should throttle requests
  res = client.post(
    "/api/make_guess",
    content=bytes(data),
    headers={"Content-Type": "application/octet-stream"},
  )
  assert res.status_code == HTTPStatus.TOO_MANY_REQUESTS


def test_inference_found(client):
  guess_id = "guess123"
  expected_status = "FOUND"
  expected_result = [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  client.app.state.cache[guess_id] = (expected_status, expected_result)
  res = client.get("/api/inference", params={"guess_id": guess_id})
  assert res.status_code == HTTPStatus.OK
  result_message = GuessResultMessage.model_validate_json(res.content)
  assert result_message.status == expected_status
  assert result_message.result == expected_result
  del client.app.state.cache[guess_id]


def test_inference_not_found(client):
  guess_id = "guess123"
  expected_status = "NOT_FOUND"
  res = client.get("/api/inference", params={"guess_id": guess_id})
  assert res.status_code == HTTPStatus.NOT_FOUND
  result_message = GuessResultMessage.model_validate_json(res.content)
  assert result_message.status == expected_status
  assert result_message.result is None
