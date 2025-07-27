from pydantic import BaseModel
from typing import Literal


class GuessResultMessage(BaseModel):
  status: Literal["FOUND", "ERROR", "NOT_FOUND"]
  result: list[float] | None = None
