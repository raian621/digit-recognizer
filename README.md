# Digit Recognizer

This is a simple web app that uses a digit recognition model to predict a digit
that a user draws on a canvas in near real-time. It uses [FastAPI](https://fastapi.tiangolo.com/)
and [Uvicorn](https://www.uvicorn.org/) to serve the app. It uses
[React](https://react.dev/) to render the client UI and
[Vite](https://vitejs.dev/) to build the client files.

## TODO

- [ ] Add model executor / pool
- [ ] Connect client to backend

## Usage

WIP

## Development

### Running the client and server

Run the client in development mode with `yarn dev` in the `client` directory.

Run the server in development mode with `pipenv run uvicorn --app-dir ./src app:app`
in the `server` directory.

### Running unit tests

Run client unit tests with `yarn test` in the `client` directory.

Run server unit tests with `pipenv run coverage run -m pytest` in the `server` directory. To view the coverage report, run `pipenv run coverage report` in the `server` directory.
