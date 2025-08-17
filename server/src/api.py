from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
import uuid
from http import HTTPStatus

from serving import ErrorMessage, QueuedMessage, GuessResultMessage
from containers import Queue, LruCache

IMAGE_SIZE = 3 * 28 * 28

router = APIRouter(prefix="/api")


def get_queue(request: Request) -> Queue:
  return request.app.state.queue


def get_cache(request: Request) -> LruCache:
  return request.app.state.cache


@router.get("/inference")
async def get_inference_result(
  guess_id: str, cache: LruCache = Depends(get_cache)
):
  maybe_result = cache[guess_id]
  if maybe_result:
    (status, result) = maybe_result
    return JSONResponse(
      GuessResultMessage(status=status, result=result).model_dump()
    )
  return JSONResponse(
    GuessResultMessage(status="NOT_FOUND").model_dump(),
    status_code=HTTPStatus.NOT_FOUND,
  )


@router.post(
  "/make_guess",
  description=(
    "Accepts an array of 28 x 28 8-bit values to be used as an input to the "
    + "digit recognition model"
  ),
  status_code=202,
  responses={
    202: {"model": QueuedMessage},
    422: {"model": ErrorMessage},
    429: {"model": ErrorMessage},
  },  # type: ignore
)
async def make_guess(request: Request, queue=Depends(get_queue)):
  # I hate this line of code, but whatever (if None, default to 0)
  payload_size = int(request.headers.get("Content-Length") or 0)
  if payload_size != IMAGE_SIZE:
    return JSONResponse(
      ErrorMessage(
        message="image data was an incorrect size"
      ).model_dump_json(),
      status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
    )
  guess_id = uuid.uuid4()
  if queue.insert((guess_id, await request.body())):
    return JSONResponse(
      QueuedMessage(guess_id=guess_id).model_dump_json(),
      status_code=HTTPStatus.ACCEPTED,
    )
  return JSONResponse(
    ErrorMessage(message="queue is full").model_dump_json(),
    status_code=HTTPStatus.TOO_MANY_REQUESTS,
  )
