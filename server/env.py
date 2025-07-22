import os

# File directory to serve the web client files from
STATIC_CLIENT_DIR = os.environ.get("STATIC_CLIENT_DIR", "../client/dist/")
