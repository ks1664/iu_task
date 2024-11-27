const _ = require('lodash');
const Joi = require('joi');

const DataHelpers = require('../../../helpers/v1/data.helpers');
const _DataHelper = new DataHelpers();

const ResponseHelper = require('../../../helpers/v1/response.helpers');
const response = new ResponseHelper();

module.exports = class TagValidation {

    async getAll(req, res, next) {
        console.log("TagValidation@getAll");

        let paginateData = await _DataHelper.getPageAndLimit(req.query);
        req.body.page = paginateData.page;
        req.body.limit = paginateData.limit;
        req.body.search = req?.query?.search;

        let schema = {
            search: Joi.string().optional(),
            page: Joi.optional(),
            limit: Joi.optional(),
        }

        let errors = await _DataHelper.joiValidation(req.body, schema);
        if (errors) {
            return response.badRequest('invalid_request', res, errors);
        }

        next();
    }
}
