"use strict";

// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
//  * to customize this controller
//  */

module.exports = {
  async findOne(ctx) {
    const _ = require("lodash");

    const knex = strapi.connections.default;
    const result = await knex("categories")
      .where("categoryName", "berlin")
      .join(
        "categories_nfts__nfts_categories",
        "categories.id",
        "categories_nfts__nfts_categories.category_id"
      )
      .join("nfts", "categories_nfts__nfts_categories.nft_id", "nfts.id")
      .select("categories.categoryName as restaurant")
      .select("nfts.name as chef");

    // Lodash's groupBy method can be used to
    // return a grouped key-value object generated from
    // the response

    return _.groupBy(result, "nfts");
  },
};
