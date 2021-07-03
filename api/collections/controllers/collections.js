"use strict";
// import axios from "axios";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;
    const entity = await strapi.services.collections.findOne({ slug });
    return entity;
    // return sanitizeEntity(entity, { model: strapi.models.collections });
  },
};
