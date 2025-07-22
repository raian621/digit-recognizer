from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.get("/inference/")
async def get_inference_result():
  pass


@router.post("/upload/")
async def upload_drawing():
  pass
