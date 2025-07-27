from fastapi.responses import JSONResponse

class ErrorMessage(JSONResponse):
  message: str