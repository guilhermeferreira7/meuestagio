## Installation

### PostgreSQL

- Install and run PostgreSQL 15 from https://www.postgresql.org/download/

### Setup .env file

- Copy .env.example to .env and enter your configuration

### Install dependencies

```bash
$ npm install
or
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# hot reload
$ nest build --webpack --webpackPath webpack-hmr.config.js --watch

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
