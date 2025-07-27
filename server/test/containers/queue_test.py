import pytest

from src.containers import Queue


def test_max_size_error():
  with pytest.raises(ValueError, match="max_size must be a positive integer"):
    Queue(0)


def test_ordering():
  queue = Queue(5)
  items = [1, 2, 3, 4, 5]
  for item in items:
    assert queue.insert(item)
  assert not queue.insert(6)
  for item in items:
    assert queue.pop() == item
  assert queue.pop() is None
