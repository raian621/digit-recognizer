import pytest

from src.containers import LruCache

def test_max_size_error():
  with pytest.raises(ValueError, match="max_size must be a positive integer"):
    LruCache(0)

def test_cache_eviction():
  cache = LruCache(1)
  cache[1] = 1
  assert cache[1] == 1
  cache[2] = 2
  assert cache[1] is None
  assert cache[2] == 2
