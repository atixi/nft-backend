"use strict";
const seaport = strapi.config.functions.openSeaApi.seaport();
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
async function fetchAssets(walletAddress) {
  const { assets } = await seaport.api.getAssets({
    owner: walletAddress,
    limit: 4,
  });
  return assets;
}
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
  async find(ctx) {
    const tals = await strapi.services.talents.find(ctx.query);
    let talents = [];

    // const data = tals.map((tal) =>
    //   fetchAssets("0xe5609a6984ece86cb5ab48b13c3ba5a55d173da8")
    // );
    // return data;

    for (let i = 0; i < tals.length; i++) {
      const data = await fetchAssets(await tals[i].walletAddress);
      talents = [
        ...talents,
        { talentName: tals[i].talentName, assets: [...data] },
      ];
    }
    return talents;
  },
};
