"use strict";
const seaport = strapi.config.functions.openSeaApi.seaport();

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;
    // return filter;
    const entity = await strapi.services.collections.findOne({ slug });
    const { offset } = ctx.query;
    const { assets } = await seaport.api.getAssets({
      collection: slug,
      limit: 10,
      offset: offset,
    });

    return { ...entity, assets };
  },
  async collectionsList() {
    const data = await strapi.services.collections.find();
    const collections = data.map((item) => {
      return {
        thumbnailUrl: item.collectionImageURL.formats.thumbnail.url,
        id: item.id,
        collection: item.collectionName,
        contractAddress: item.contractAddress,
        slug: item.slug,
      };
    });
    return collections;
  },
};
