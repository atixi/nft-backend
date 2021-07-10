"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { userName } = ctx.params;
    const entity = await strapi.services.talents.findOne({ userName });

    return { ...entity };
    // return sanitizeEntity(entity, { model: strapi.models.collections });
  },
};
