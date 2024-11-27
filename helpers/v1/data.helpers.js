const _ = require("lodash");
const Joi = require("joi");
const i18n = require("i18n");
const fs = require("fs");

module.exports = class DataHelper {
  async joiValidation(reqBody, schema, language = "en") {
    console.log("DataHelper@joiValidation");

    try {
      await Joi.object(schema).validateAsync(reqBody);
      return false;
    } catch (errors) {
      let parsedErrors = [];

      // console.log("Error :", errors.details);

      if (errors.details) {
        errors = errors.details;
        for (let e of errors) {
          // console.log("e :", e);
          let msg = i18n.__(e.type, e.context);
          parsedErrors.push(msg);
        }
      }

      if (parsedErrors.length > 0) {
        return parsedErrors;
      }
    }
  }

  async getPageAndLimit(reqQuery) {
    console.log("DataHelper@getPageAndLimit");
    let resObj = {
      page: 1,
      limit: 200,
    };
    if (reqQuery.page) {
      if (typeof parseInt(reqQuery.page) !== "number") {
        return {
          error: true,
          msg: "invalid page value",
          code: 400,
        };
      }

      if (parseInt(reqQuery.page) < 1) {
        return {
          error: true,
          msg: "page must be a positive value",
          code: 400,
        };
      }

      resObj.page = parseInt(reqQuery.page);
    }

    if (reqQuery.limit) {
      if (typeof parseInt(reqQuery.limit) !== "number") {
        return {
          error: true,
          msg: "invalid limit value",
          code: 400,
        };
      }

      if (parseInt(reqQuery.limit) < 1) {
        return {
          error: true,
          msg: "limit must be a positive value",
          code: 400,
        };
      }

      if (parseInt(reqQuery.limit) > 100) {
        resObj.limit = 100;
      } else {
        resObj.limit = parseInt(reqQuery.limit);
      }
    }

    return resObj;
  }

  async pagination(totalItems = null, pageNo = null, limit = null) {
    console.log("DataHelper@pagination");
    // set a default pageNo if it's not provided
    if (!pageNo) {
      pageNo = 1;
    }

    // set a default limit if it's not provided
    if (!limit) {
      if (totalItems > 50) {
        limit = 50;
      } else {
        limit = totalItems;
      }
    } else {
      if (limit > totalItems) {
        limit = totalItems;
      }
    }

    let totalPages = Math.ceil(totalItems / limit);
    if (totalPages < 1) {
      totalPages = 1;
    }

    // if the page number requested is greater than the total pages, set page number to total pages
    if (pageNo > totalPages) {
      pageNo = totalPages;
    }

    let offset;
    if (pageNo > 1) {
      offset = (pageNo - 1) * limit;
    } else {
      offset = 0;
    }

    return {
      pageNo,
      totalPages,
      offset,
      limit,
    };
  }
};
