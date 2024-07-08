const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

const indexRouter = require('./routes/index');
const blockchainRouter = require('./routes/blockchain');

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/blockchain', blockchainRouter);

const server_port = process.env.SERVER_PORT || 2000;

app.listen(server_port, () => {
  console.log(`Server is running on port: ${server_port}`);
});

module.exports = app;
