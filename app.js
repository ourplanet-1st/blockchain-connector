/*jslint node: true*/
'use strict';
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const APP_ROOT_DIR = __dirname;

// Setup Express Framework
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bankAccount = require(path.join(APP_ROOT_DIR, 'routers/bank_account'));
const project = require(path.join(APP_ROOT_DIR, 'routers/project'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Router
app.use('/v1', bankAccount);
app.use('/v1', project);

const port = process.env.PORT;
async function init() {
  app.listen(port, () => {
    console.log(`[${process.env.NODE_ENV}] Project Finance API server listening at http://localhost:${port}`);
  });
  module.exports = app;
}

init();