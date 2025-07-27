"""
This file contains an implementation of a thread-safe queue
"""

from .util import RwLock
from collections import deque


class Queue:
  rw_lock: RwLock
  queue: deque

  def __init__(self, max_size: int):
    if max_size < 1:
      raise ValueError("max_size must be a positive integer")
    self.max_size = max_size
    self.rw_lock = RwLock()
    self.queue = deque()

  def insert(self, item):
    self.rw_lock.lock_write()
    success = False
    if len(self.queue) < self.max_size:
      self.queue.append(item)
      success = True
    self.rw_lock.unlock_write()
    return success

  def pop(self):
    self.rw_lock.lock_write()
    value = self.queue.popleft() if self.queue else None
    self.rw_lock.unlock_write()
    return value
