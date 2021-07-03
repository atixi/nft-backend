'use strict';
module.exports = {
  async findOne(ctx) {

  const seaport = strapi.config.functions.openSeaApi.openSea();
      const {id, address} = ctx.params;

      const OpenSeaAsset = await seaport.api.getAsset({
          tokenAddress: address,
          tokenId: id
        })
        return OpenSeaAsset;
      },
};
