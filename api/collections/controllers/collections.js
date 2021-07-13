"use strict";

const seaport = strapi.config.functions.openSeaApi.seaport();
// import axios from "axios";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;
    // return filter;
    const entity = await strapi.services.collections.findOne({ slug });
    const { offset } = ctx.query;
    const assets = await seaport.api.getAssets({
      collection: slug,
      limit: 10,
      offset: offset,
    });

    return { ...entity, assets };
  },
};
