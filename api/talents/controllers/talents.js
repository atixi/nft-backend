"use strict";
const seaport = strapi.config.functions.openSeaApi.seaport();
const _ = require("lodash");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
async function fetchAssets(walletAddress) {
  const { assets } = await seaport.api.getAssets({
    owner: walletAddress,
    limit: 50,
  });
  return assets;
}

module.exports = {
  async findOne(ctx) {
    const { walletAddress } = ctx.params;
    const entity = await strapi.services.talents.findOne({ walletAddress });
    const { offset } = ctx.query;
    const { assets } = await seaport.api.getAssets({
      owner: entity.walletAddress,
      limit: 10,
      offset: offset,
    });
    return { ...entity, assets };
  },

  async find(ctx) {
    const tals = await strapi.services.talents.find(ctx.query);
    let talents = [];

    for (let i = 0; i < tals.length; i++) {
      const data = await fetchAssets(tals[i].walletAddress);
      talents = [
        ...talents,
        {
          userName: tals[i].userName,
          talentName: tals[i].talentName,
          walletAddress: tals[i].walletAddress,
          bio: tals[i].bio,
          talentAvatar: { url: tals[i].talentAvatar.url },
          totalOfSales: _.sumBy(data, function (o) {
            return o.lastSale;
          }),
          assets: [...data],
        },
      ];
    }
    return talents;
  },

  async search(ctx) {
    const { searchWord } = ctx.params;
    const talents = await strapi.services.talents.find({
      talentName_contains: searchWord,
    });
    const collections = await strapi.services.collections.find({
      collectionName_contains: searchWord,
    });
    const assets = await strapi.services.nfts.find({
      name_contains: searchWord,
    });

    return { talents: talents, collections: collections, assets: assets };
  },
};
