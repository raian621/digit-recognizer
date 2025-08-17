from typing import List, Optional, Tuple

from .model import DigitClassifierModel
from containers import Queue, LruCache


class Processor:
  def __init__(
    self, model: DigitClassifierModel, queue: Queue, cache: LruCache
  ):
    self.model = model
    self.queue = queue
    self.cache = cache

  def process_guess(self) -> Optional[Tuple[str, List[float]]]:
    guess = self.queue.pop()
    if guess is None:
      return None
    guess_id, image = guess
    prediction = self.model.predict(image)
    return guess_id, prediction

  def publish_prediction(self, prediction: List[float], guess_id: str):
    self.cache[guess_id] = ("FOUND", prediction)
