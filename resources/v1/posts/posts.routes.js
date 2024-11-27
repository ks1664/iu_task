const express = require('express');
const routes = express.Router();

const PostsController = require('./posts.controller');
const posts = new PostsController();

const PostsValidation = require('./posts.validation')
const validation = new PostsValidation();

routes.post('/', [validation.createOne], posts.createOne)
routes.get('/', [validation.getAll], posts.getAll)

module.exports = routes;
