var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vinet', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersPartner = require('./routes/partner');
var loggerFile = require('./logger');
var app = express();

// view engine setup


app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/order', indexRouter);
app.use('/partner', usersPartner);
app.use('/', usersRouter);

// catch 404 and forward to error handler


// error handler

app.use(function(err, req, res, next) {
    console.error(err);
    loggerFile.info(req.originalUrl +'\n'+err.stack)
});
module.exports = app;
