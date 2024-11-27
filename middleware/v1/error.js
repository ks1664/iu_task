const winston = require('winston');
require('express-async-errors'); // automatically handle async errors

module.exports = function(err, req, res, next) {
    console.log('errorMiddleware', err);

    res.status(500).send({
        msg: 'there was an error processing the request',
        error: err.message,
    })
}