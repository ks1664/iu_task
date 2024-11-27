const _ = require("lodash");

const TagResource = require("./tags.resources");
const _Tag = new TagResource();

const ResponseHelper = require("../../../helpers/v1/response.helpers");
const response = new ResponseHelper();

const DataHelper = require("../../../helpers/v1/data.helpers");
const datahelper = new DataHelper();

module.exports = class TagController {
  async getAll(req, res) {
    console.log("TagController@getAll");

    const data = _.pick(req.body, ["search", "page", "limit"]);

    let result = await _Tag.getAll(data);
    if (!result) {
      return response.badRequest("no tags found", res, false);
    }

    return response.success("all tags found successfully ", res, result);
  }
};
