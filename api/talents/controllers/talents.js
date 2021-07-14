"use strict";
const seaport = strapi.config.functions.openSeaApi.seaport();
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { userName } = ctx.params;
    const entity = await strapi.services.talents.findOne({ userName });
    const { offset } = ctx.query;
    const { assets } = await seaport.api.getAssets({
      owner: entity.walletAddress,
      limit: 10,
      offset: offset,
    });
    return { ...entity, assets };
    // return sanitizeEntity(entity, { model: strapi.models.collections });
  },
};
