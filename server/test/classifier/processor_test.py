import pytest
from typing import cast


from src.containers import Queue, LruCache
from src.classifier import Processor, DigitClassifierModel


@pytest.fixture
def queue() -> Queue:
  return Queue(100)


@pytest.fixture
def cache() -> LruCache:
  return LruCache(100)


class MockModel:
  def __init__(self):
    pass

  def predict(self, _x):
    return [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]


def test_process_guess(queue: Queue, cache: LruCache):
  processor = Processor(cast(DigitClassifierModel, MockModel()), queue, cache)
  expected_guess_id = "guess123"
  result = processor.process_guess()
  assert result is None  # queue is empty
  queue.insert((expected_guess_id, b""))
  result = processor.process_guess()
  assert result is not None
  guess_id, prediction = result
  assert guess_id == expected_guess_id
  assert prediction == [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]


def test_publish_guess(queue: Queue, cache: LruCache):
  processor = Processor(cast(DigitClassifierModel, MockModel()), queue, cache)
  expected_prediction = [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  expected_guess_id = "guess123"
  processor.publish_prediction(expected_prediction, expected_guess_id)
  result = cache[expected_guess_id]
  assert result is not None
