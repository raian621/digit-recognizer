from os import environ

# File directory to serve the web client files from
STATIC_CLIENT_DIR = environ.get("STATIC_CLIENT_DIR", "../client/dist/")
