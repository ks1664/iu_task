require('dotenv').config();

// create a global CONFIG object that can be throughout the application
let CONFIG = {};

CONFIG.env = process.env.ENV || 'dev';
CONFIG.port = process.env.APPLICATION_PORT || '7000';

CONFIG.api_ver = process.env.API_VER;

if (process.env.ENV === 'prod' || process.env.ENV === 'production') {
    CONFIG.cors_whitelist = ['http://localhost:3000'];} else if (process.env.ENV === 'stag' || process.env.ENV === 'staging') {
    CONFIG.cors_whitelist = ['http://localhost:3000'];} else {
    CONFIG.cors_whitelist = ['http://localhost:3000'];
}

module.exports = CONFIG;
