'use strict';
var winston = require('winston');
const path = require('path');

var logger =  winston.createLogger({
    level: 'info',
    format: winston.format.printf(info => new Date()+`: ${info.message}`),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, 'error.log'),
            level: 'info',
        })
    ]
});
module.exports = logger;