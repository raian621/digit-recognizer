from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from src.serving import ErrorMessage

IMAGE_SIZE = 3 * 28 * 28

router = APIRouter(prefix="/api")


@router.get("/inference/")
async def get_inference_result():
  pass


@router.post(
  "/make_guess/",
  description=(
    "Accepts an array of 28 x 28 8-bit values to be used as an input to the "
    + "digit recognition model"
  ),
  response_class={422: ErrorMessage},
)
async def make_guess(request: Request):
  payload_size = request.headers.get("Content-Length")
  if payload_size != IMAGE_SIZE:
    return JSONResponse(
      ErrorMessage("image data was an incorrect size"), status_code=422
    )
