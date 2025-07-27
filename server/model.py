from concurrent.futures import ThreadPoolExecutor
from typing import Literal

# Holds multiple threads that use the same model data to perform inference
class ModelPool:
  executor: ThreadPoolExecutor
  device: Literal["cuda", "cpu"]

  def __init__(self, threads: int):
    self.executor = ThreadPoolExecutor(threads)

  def load_model(self, model_path: str):
    pass

  def guess(self, image):
    pass
