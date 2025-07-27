from threading import Lock

class RwLock:
  reader_lock: Lock
  writer_lock: Lock
  reader_count: int

  def __init__(self):
    self.reader_lock = Lock()
    self.writer_lock = Lock()
    self.reader_count = 0

  def lock_read(self):
    self.reader_lock.acquire()
    self.reader_count += 1
    if self.reader_count == 1:
      self.writer_lock.acquire()
    self.reader_lock.release()

  def unlock_read(self):
    self.reader_lock.acquire()
    self.reader_count -= 1
    if self.reader_count == 0:
      self.writer_lock.release()
    self.reader_lock.release()
  
  def lock_write(self):
    self.writer_lock.acquire()

  def unlock_write(self):
    self.writer_lock.release()