"""
This file contains an implementation of a thread-safe LRU cache
"""

from collections import OrderedDict
from .util import RwLock


class LruCache:
  """
  Thread-safe LRU cache
  """

  data: OrderedDict
  max_size: int
  rw_lock: RwLock

  def __init__(self, max_size: int):
    if max_size < 1:
      raise ValueError("max_size must be a positive integer")
    self.max_size = max_size
    self.rw_lock = RwLock()
    self.data = OrderedDict()

  def __getitem__(self, key):
    self.rw_lock.lock_read()
    value = self.data.get(key, None)
    self.rw_lock.unlock_read()
    if value:
      self[key] = value
    return value

  def __setitem__(self, key, value):
    self.rw_lock.lock_write()
    self.data[key] = value
    if len(self.data) > self.max_size:
      self.data.popitem(last=False)
    self.rw_lock.unlock_write()

  def __delitem__(self, key):
    self.rw_lock.lock_write()
    del self.data[key]
    self.rw_lock.unlock_write()
