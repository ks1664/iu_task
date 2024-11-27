const express = require('express');
const routes = express.Router();

const TagsController = require('./tags.controller');
const tag = new TagsController();

const TagsValidation = require('./tags.validation')
const validation = new TagsValidation();

routes.get('/', [validation.getAll], tag.getAll);

module.exports = routes;
