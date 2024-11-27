const _ = require("lodash");

const PostsResource = require("./posts.resources");
const _Posts = new PostsResource();

const ResponseHelper = require('../../../helpers/v1/response.helpers');
const response = new ResponseHelper();

const DataHelper = require('../../../helpers/v1/data.helpers')
const datahelper = new DataHelper();


module.exports = class PostsController {

    async createOne(req, res) {
        console.log("PostsController@createOne");
        const data = _.pick(req.body, ['title', 'jobTitle', 'jobDetails'])


        let checkTemplateExist = await _ContractTemplate.getByTitleAndUserId(data.title, req.user._id)

        if (checkTemplateExist) {
            return response.badRequest("Title already taken", res, false);
        }

        await Promise.all(data.jobDetails.map(async (job) => {
            if (job?.mitreStyles?.length) {
                let ab = job.mitreStyles.filter((mitre) => {
                    if (mitre.mitreCount != '') {
                        return mitre
                    }
                })
                job.mitreStyles = ab
            }

            if (job.subCategoryId == '') {
                delete job.subCategoryId
            }
            if (job.colorId == '') {
                delete job.colorId
            }
            if (job.materialId == '') {
                delete job.materialId
            }
            if (job.sizeId == '') {
                delete job.sizeId
            }

            let totalPrice = 0;
            let unitPrice = parseFloat(job.unitPrice)
            job.unitPrice = (Math.round(unitPrice * 100) / 100)
            if (!job.quantity) {
                totalPrice = unitPrice
            } else {
                totalPrice = job.quantity * unitPrice
            }
            job.totalPrice = (Math.round(totalPrice * 100) / 100)
            return job
        }))


        const contractTemplateData = {
            title: data.title,
            jobTitle: data.jobTitle,
            jobDetails: data.jobDetails,
            userId: req.user._id,
            createdBy: req.user.role
        }

        let result = await _ContractTemplate.createOne(contractTemplateData);

        if (!result) {
            return response.badRequest("Template not created", res, false);
        }

        return response.success(`Template saved successfully.`, res, true)
    }

    async getAll(req, res) {
        console.log("ContractTemplateController@getAll");
        const data = _.pick(req.body, ['search', 'page', 'limit'])

        let result = await _ContractTemplate.getAll(data, req.user._id);
        if (!result) {
            return response.badRequest("No template found", res, false);
        }

        return response.success("All templates found successfully ", res, result)

    }
}
