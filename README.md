# MES Auditing
General purpose auditing system

Details of the endpoints can be found in the [docs](docs) directory.

[![Dependency Status](https://david-dm.org/MindsEyeSociety/audit.svg)](https://david-dm.org/MindsEyeSociety/audit)
[![Build Status](https://travis-ci.org/MindsEyeSociety/audit.svg?branch=master)](https://travis-ci.org/MindsEyeSocietyaudit)

## Installation
1. `npm install`
2. `npm install -g knex`
3. Configure the DB in `config/db.json`.
4. `knex migrate:latest`.
5. Start the server with `node app.js`.

## Config
* `db` - Database credentials.
* `hub` - URL of User Hub.

## Tests
Tests are run with Mocha and Supertest. They can be run with `NODE_ENV=testing mocha` locally. `grunt` is also used to lint the code.
