from typing import List
import keras


class DigitClassifierModel(keras.Model):
  def __init__(self, model: keras.Model):
    self.model = model

  def predict(self, x) -> List[float]:
    return self.model.predict(x)
