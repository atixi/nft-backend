'use strict';
const { sanitizeEntity } = require('strapi-utils');
module.exports = {
  async findOne(ctx) {
  const seaport = strapi.config.functions.openSeaApi.seaport();
      const {id, address} = ctx.params;

      const OpenSeaAsset = await seaport.api.getAsset({
          tokenAddress: address,
          tokenId: id
        })
        return OpenSeaAsset;
      },

      
      async find(ctx) {
        let entities;
        // if (ctx.query._q) {
        //   entities = await strapi.services.nft.search(ctx.query);
        // } else {
          entities = await strapi.services.nft.find();
        // }
    
        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.nft }));
      },
};
