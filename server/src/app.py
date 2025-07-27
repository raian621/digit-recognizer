from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src import api, env

app = FastAPI()
app.include_router(api.router)
app.mount(
  "/", StaticFiles(directory=env.STATIC_CLIENT_DIR, html=True), name="static"
)
