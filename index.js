const express = require('express');
const app = express();
let server;

/**
 * configure shared state
 */

require('./startup')(app);
require('./config/v1/mongodb');

const port = process.env.APPLICATION_PORT || 8002;

if (process.env.SSL_STATUS === 'true') {
    const fs = require('fs');
    let key = fs.readFileSync(process.env.SSL_KEY_PEM_PATH, 'utf8').toString();
    let cert = fs.readFileSync(process.env.SSL_CERT_PEM_PATH, 'utf8').toString();

    const options = {
        key: key,
        cert: cert
    };
    server = require('https').createServer(options, app);
} else {
    server = require('http').Server(app);
}


server.listen(port, async (req, res) => {
    const error = require('./middleware/v1/error');

    // routes
    await require('./startup/routes')(app);

    app.use(error);
    console.log('listening on port: ', port);
});