from os import environ

# File directory to serve the web client files from
STATIC_CLIENT_DIR = environ.get("STATIC_CLIENT_DIR", "../client/dist/")
INFERENCE_THREADS = int(environ.get("INFERENCE_THREADS", 1))
MAX_QUEUE_SIZE = int(environ.get("MAX_QUEUE_SIZE", 10_000))
MAX_LRU_CACHE_SIZE = int(environ.get("MAX_LRU_CACHE_SIZE", 10_000))
HOST = environ.get("HOST", "localhost")
PORT = int(environ.get("PORT", 8000))
MODE = environ.get("MODE", "dev")
