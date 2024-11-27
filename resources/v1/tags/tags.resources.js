const Tags = require("./tag.model");

const DataHelper = require("../../../helpers/v1/data.helpers");
const datahelper = new DataHelper();

module.exports = class TagResource {
  async getAll(data) {
    console.log("TagResource@getAll");

    let query = {};

    if (data.search) {
      query = {
        ...query,
        $and: [{ name: { $regex: data.search, $options: "i" } }],
      };
    }

    let totalRecords = await Tags.countDocuments(query);

    let pagination = await datahelper.pagination(
      totalRecords,
      data.page,
      data.limit
    );

    let results = await Tags.find(query)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .select("name")
      .sort({ createdAt: 1 });

    if (!results) {
      return false;
    }

    let resObj = {
      total: totalRecords,
      current_page: pagination.pageNo,
      total_pages: pagination.totalPages,
      per_page: pagination.limit,
      data: results,
    };

    return resObj;
  }
};
