"use strict";

// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
//  * to customize this controller
//  */

module.exports = {
  async findOne(ctx) {
    // const { slug } = ctx.params;
    // // const entity = await strapi.services.categories.findOne({ slug });
    // // return { ...entity };
    // const category = strapi
    //   .query("categories")
    //   .findOne({ slug }, ["categories.categoryName", "nfts", "nfts.talent"]);
    // const nfts = strapi.query("nfts").find({ name_contains: "nu" });
    // return nfts;

    // const knex = require("knex")({
    //   client: "postgres",
    //   connection: {
    //     host: "ec2-54-197-100-79.compute-1.amazonaws.com",
    //     user: "yeqluzatluhqfo",
    //     password:
    //       "1e795ddb37ac62ade4dffae1054e341d1ebddd8b5a7d2431060ba1d046c4173e",
    //     database: "d2u4i8ggkk26o9",
    //     charset: "utf8",
    //   },
    // });
    // const bookshelf = require("bookshelf")(knex);

    // const User = bookshelf.model("Categories", {
    //   tableName: "categories",
    // });
    // return User;

    const _ = require("lodash");

    const knex = strapi.connections.default;
    const result = await knex("categories")
      .where("categoryName", "berlin")
      .join("nfts", "category.id", "nfts.categories_id")
      .select("categories.categoryName as restaurant")
      .select("nfts.name as chef");

    // Lodash's groupBy method can be used to
    // return a grouped key-value object generated from
    // the response

    return _.groupBy(result, "nfts");
  },
};
