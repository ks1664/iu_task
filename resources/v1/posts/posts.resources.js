const Posts = require("./posts.model");

const DataHelper = require("../../../helpers/v1/data.helpers");
const datahelper = new DataHelper();

module.exports = class PostsResource {
  async createOne(data) {
    console.log("PostsResource@createone");
    if (!data || data === "") {
      throw new Error("Data is required");
    }
    // Insert the ContractTemplate data
    let result = await Posts.create(data);
    if (!result) {
      return false;
    }
    return result;
  }

  async getAll(data, id) {
    console.log("PostsResource@getAll");
    let searchQuery = {
      $or: [
        { title: { $regex: data.search, $options: "i" } },
        { description: { $regex: data.search, $options: "i" } },
      ],
    };

    let query = {
      ...(data.search && searchQuery),
    };

    let sortObj = {};

    if (data.sortKey == "title" && data.sortOrder == "asc") {
      sortObj = { title: 1 };
    } else if (data.sortKey == "title" && data.sortOrder == "desc") {
      sortObj = { title: -1 };
    } else if (data.sortKey == "createdAt" && data.sortOrder == "asc") {
      sortObj = { createdAt: 1 };
    } else if (data.sortKey == "createdAt" && data.sortOrder == "desc") {
      sortObj = { createdAt: -1 };
    }

    let totalRecords = await Posts.countDocuments(query);
    let pagination = await datahelper.pagination(
      totalRecords,
      data.page,
      data.limit
    );
    let results = await Posts.find(query)
      .select("title description photo tags createdAt")
      .sort(sortObj)
      .skip(pagination.offset)
      .limit(pagination.limit === 0 ? 1 : pagination.limit);

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

  async checkExist(title) {
    console.log("PostsResource@checkExist");

    if (!title || title === "") {
      throw new Error("Title is required");
    }

    let result = await Posts.findOne({ title: title }).collation({
      locale: "en",
      strength: 2,
    });

    if (!result) {
      return false;
    }

    return result;
  }
};
