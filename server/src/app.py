from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
from prometheus_fastapi_instrumentator import Instrumentator

import env
import api
from containers import Queue, LruCache


queue = Queue(env.MAX_QUEUE_SIZE)
cache = LruCache(env.MAX_LRU_CACHE_SIZE)
app = FastAPI()
Instrumentator().instrument(app).expose(app, endpoint="/prometheus/metrics")
app.state.queue = queue
app.state.cache = cache
app.include_router(api.router)
app.mount(
  "/", StaticFiles(directory=env.STATIC_CLIENT_DIR, html=True), name="static"
)

if __name__ == "__main__":
  uvicorn.run(
    "app:app",
    host=env.HOST,
    port=env.PORT,
    log_level="info",
    reload=True if env.MODE == "dev" else False,
  )
