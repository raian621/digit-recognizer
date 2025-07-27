from pydantic import BaseModel, UUID4


class QueuedMessage(BaseModel):
  guess_id: UUID4
