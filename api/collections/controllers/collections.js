"use strict";
const { sanitizeEntity, parseMultipartData } = require("strapi-utils");

const seaport = strapi.config.functions.openSeaApi.seaport();

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;
    // return filter;
    const entity = await strapi.services.collections.findOne({ slug });
    const { offset } = ctx.query;
    try {
      const { assets } = await seaport.api.getAssets({
        collection: slug,
        limit: 10,
        offset: offset,
      });

      return { ...entity, assets };
    } catch (error) {
      return { ...entity, assets: [] };
    }
  },
  async collectionslist(ctx) {
    const data = await strapi.services.collections.find();
    if (!data) {
      return {
        success: false,
        message: "Can not load data",
      };
    }
    const collections = data.map((item) => {
      return {
        thumbnailUrl: item.collectionImageURL?.formats?.thumbnail.url,
        id: item.id,
        collectionName: item.collectionName,
        contractAddress: item.contractAddress,
        talentAddress: item.talentAddress,
        slug: item.slug,
      };
    });
    return collections;
  },

  async collectionexist(ctx) {
    const { account } = ctx.params;
    const collections = await strapi.services.collections.find();

    for (var i = 0; i < collections.length; i++) {
      if (collections[i].slug == account) {
        return true;
      }
    }
    return false;
  },

  async create(ctx) {
    let entity;
    const { data, files } = parseMultipartData(ctx);
    entity = await strapi.services.collections.create(data, {
      files,
    });
    strapi.serverBroadCastNewCollection(entity, {
      model: strapi.query("collections").model,
    });
    return sanitizeEntity(entity, { model: strapi.query("collections").model });
  },
};
