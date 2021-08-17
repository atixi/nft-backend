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
          ...tals[i],
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

  async talentexists(ctx) {
    const { account } = ctx.params;
    const talents = await strapi.services.talents.find();
    if (!talents) {
      return {
        success: false,
        message: "Server is not available",
      };
    }
    for (var i = 0; i < talents.length; i++) {
      if (talents[i].walletAddress == account) {
        return {
          success: true,
          account: talents[i]?.walletAddress,
          id: talents[i].id,
          message: "Talent Exists",
        };
      }
    }
    return {
      success: false,
      account: null,
      message: "Talent not exists",
    };
  },
};
