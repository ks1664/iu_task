const _ = require("lodash");
const Joi = require("joi");

const DataHelpers = require("../../../helpers/v1/data.helpers");
const _DataHelper = new DataHelpers();

const ResponseHelper = require("../../../helpers/v1/response.helpers");
const response = new ResponseHelper();

module.exports = class PostsValidation {
  async createOne(req, res, next) {
    console.log("PostsValidation@createOne");
    let schema = {
      title: Joi.string().required(),
      description: Joi.string().optional(),
      photo: Joi.string().optional(),
      tags: Joi.array().optional(),
    };

    let errors = await _DataHelper.joiValidation(req.body, schema);
    if (errors) {
      return response.badRequest("invalid_request", res, errors);
    }

    next();
  }

  async getAll(req, res, next) {
    console.log("PostsValidation@getAll");
    req.body = req.query;
    let paginateData = await _DataHelper.getPageAndLimit(req.query);
    req.body.page = paginateData.page;
    req.body.limit = paginateData.limit;

    let schema = {
      search: Joi.string().optional(),
      tag: Joi.string().optional(),
      sortKey: Joi.string().valid("title", "createdBy").optional(),
      sortOrder: Joi.string().valid("asc", "desc").optional(),
      page: Joi.optional(),
      limit: Joi.optional(),
    };

    let errors = await _DataHelper.joiValidation(req.body, schema);
    if (errors) {
      return response.badRequest("invalid_request", res, errors);
    }

    next();
  }
};
