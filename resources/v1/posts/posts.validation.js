const _ = require('lodash');
const Joi = require('joi');

const DataHelpers = require('../../../helpers/v1/data.helpers');
const _DataHelper = new DataHelpers();

const ResponseHelper = require('../../../helpers/v1/response.helpers');
const response = new ResponseHelper();

module.exports = class PostsValidation {

    async createOne(req, res, next) {
        console.log("PostsValidation@createOne");
        let schema = {
            title: Joi.string().required(),
            jobTitle: Joi.string().required(),
            jobDetails: Joi.array().items(Joi.object({
                categoryId: Joi.string().required(),
                categoryName: Joi.string().required(),
                categorySlug: Joi.string().required(),
                categoryType: Joi.string().required(),
                description: Joi.string().required(),
                subCategoryId: Joi.string().allow('',null).optional(),
                subCategoryName: Joi.string().allow('',null).optional(),
                subCategorySlug: Joi.string().allow('',null).optional(),
                colorId: Joi.string().allow('',null).optional(),
                colorName: Joi.string().allow('',null).optional(),
                materialId: Joi.string().allow('',null).optional(),
                materialName: Joi.string().allow('',null).optional(),
                mitreStyles: Joi.array().items(Joi.object({
                    mitreType: Joi.string().valid('custom', 'list').optional(),
                    mitreLabel: Joi.string().allow('',null).optional(),
                    mitreStyleId: Joi.string().allow('',null).optional(),
                    mitreValue: Joi.string().allow('',null).optional(),
                    mitreCount: Joi.string().allow('',null).optional(),
                })),
                hangerTypes: Joi.array().items(Joi.object({
                    hangerId: Joi.string().allow('',null).optional(),
                    hangerCount: Joi.string().allow('',null).optional(),
                    hangerName: Joi.string().allow('',null).optional(),
                })),
                elbowType: Joi.object({
                    a: Joi.number().optional(),
                    b: Joi.number().optional(),
                    c: Joi.number().optional()
                }),
                sizeId: Joi.string().allow('',null).optional(),
                sizeName: Joi.string().allow('',null).optional(),
                unitPrice: Joi.string().allow('',null).optional(),
                quantity: Joi.number().allow(null).optional(),
                totalPrice: Joi.string().optional(),
                photos: Joi.array().required()
            })),
        }

        let errors = await _DataHelper.joiValidation(req.body, schema);
        if (errors) {
            return response.badRequest('invalid_request', res, errors);
        }


        next()
    }

    async getAll(req, res, next) {
        console.log("PostsValidation@getAll");
        let paginateData = await _DataHelper.getPageAndLimit(req.query);
        req.body.page = paginateData.page;
        req.body.limit = paginateData.limit;
        req.body.search = req?.query?.search;
        next();
    }
}
