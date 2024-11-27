const _ = require("lodash");

const PostsResource = require("./posts.resources");
const _Posts = new PostsResource();

const ResponseHelper = require("../../../helpers/v1/response.helpers");
const response = new ResponseHelper();

const DataHelper = require("../../../helpers/v1/data.helpers");
const datahelper = new DataHelper();

module.exports = class PostsController {
  async createOne(req, res) {
    console.log("PostsController@createOne");
    const data = _.pick(req.body, ["title", "description", "photo", "tags"]);

    let checkExist = await _Posts.checkExist(data.title);

    if (checkExist) {
      return response.badRequest("Title already taken", res, false);
    }

    const dataToSave = {
      title: data.title,
      description: data.description,
      photo: data.photo,
      tags: data.tags,
    };

    let result = await _Posts.createOne(dataToSave);

    if (!result) {
      return response.badRequest("Post not created", res, false);
    }

    return response.success(`Post saved successfully.`, res, true);
  }

  async getAll(req, res) {
    console.log("PostsController@getAll");
    const data = _.pick(req.body, [
      "search",
      "tag",
      "sortKey",
      "sortOrder",
      "page",
      "limit",
    ]);

    let result = await _Posts.getAll(data);
    if (!result) {
      return response.badRequest("No posts found", res, false);
    }

    return response.success("All posts found successfully ", res, result);
  }
};
