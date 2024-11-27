const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Posts = require('./posts.model');

const DataHelper = require('../../../helpers/v1/data.helpers');
const datahelper = new DataHelper();

module.exports = class ContractTemplateResource {

    async createOne(data) {
        console.log("ContractTemplateResource@createone");
        if (!data || data === '') {
            throw new Error('Data is required');
        }
        // Insert the ContractTemplate data 
        let result = await ContractTemplate.create(data);
        if (!result) {
            return false;
        }
        return result;
    }

    async getAll(data, id) {
        console.log("ContractTemplateResource@getAll");
        let searchQuery = { 'title': { $regex: data.search, $options: 'i' } }

        let legacyQuery = {
            $or: [
                { createdBy: 'admin' },
                { userId: id }
            ]
        }
        let query = {
            ...(data.search && searchQuery),
            ...(id && legacyQuery),
        };

        let totalRecords = await ContractTemplate.count(query);
        let pagination = await datahelper.pagination(totalRecords, data.page, data.limit);
        let results = await ContractTemplate.find(query).select('title createdBy updatedAt').sort({ createdBy: 1, updatedAt: -1 }).skip(pagination.offset).limit(pagination.limit === 0 ? 1 : pagination.limit)

        if (!results) {
            return false;
        }

        let resObj = {
            total: totalRecords,
            current_page: pagination.pageNo,
            total_pages: pagination.totalPages,
            per_page: pagination.limit,
            data: results,
        }

        return resObj;

    }

    async getOne(id) {
        console.log('ContractTemplateResource@getOne');

        if (!id || id === '') {
            throw new Error('id is required');
        }

        let contractTemplateDetail = await ContractTemplate.findOne({ _id: id }).lean()

        if (!contractTemplateDetail) {
            return false;
        }
        return contractTemplateDetail;
    }

    async getByTitleAndUserId(title, userId) {
        console.log('ContractTemplateResource@getByTitleAndUserId');

        if (!title || title === '') {
            throw new Error('Title is required');
        }

        let result = await ContractTemplate.findOne({
            title: title,
            $or: [
                { createdBy: 'admin' },
                { userId: userId }
            ]
        })

        if (!result) {
            return false;
        }

        return result;
    }

    async getByTitleAndUserIdNotId(title, userId, id) {
        console.log('ContractTemplateResource@getByTitleAndUserId');

        if (!title || title === '') {
            throw new Error('Title is required');
        }

        let result = await ContractTemplate.findOne({
            title: title, $or: [
                { createdBy: 'admin' },
                { userId: userId }
            ], _id: { $ne: ObjectId(id) }
        })

        if (!result) {
            return false;
        }

        return result;
    }

    async updateOne(data, id) {

        console.log('ContractTemplateResource@updateOne');

        if (!data || data === '') {
            throw new Error('Data is required');
        }

        // Update the contract data 
        let result = await ContractTemplate.findByIdAndUpdate(id, data, { new: true });
        if (!result) {
            return false;
        }

        return result;
    }

    async deleteOne(id) {
        console.log('ContractTemplateResource@deleteOne');

        if (!id || id === '') {
            throw new Error('id is required');
        }

        let result = await ContractTemplate.findByIdAndDelete(id)
        if (!result) {
            return false;
        }
        return true;
    }
}