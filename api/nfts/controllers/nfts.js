'use strict';
const { sanitizeEntity } = require('strapi-utils');
const axios = require("axios")
const seaport = strapi.config.functions.openSeaApi.seaport();
const getAssetsByOwner = (owner) => {
  return seaport.api.getAssets({
    owner,
    limit: 40
  });
};
const getAssetsByOwners = async(owners) => {
  const promises = [];
  for (let i = 0; i < owners.length; i++) {
    const data = await getAssetsByOwner(owners[i])
    promises.push( data);
  }
  return Promise.allSettled(promises);
};
const mergeAssetsByOwners = (result) => {
  let assets = [];
  for (let i = 0; i < result.length; i++) {
    assets = [...assets, ...result[i].value.assets];
  }
  return assets;
};

module.exports = {
  async findOne(ctx) {
      const {id, address} = ctx.params;
        const OpenSeaAsset = await seaport.api.getAsset({
          tokenAddress: address,
          tokenId: id
        })
        return OpenSeaAsset
     
      },

      
      async find(ctx) {
        const owners = [
          "0xe5609a6984ece86cb5ab48b13c3ba5a55d173da8",
          "0xff6539f953eb682d442c70ae0a9e186dd9668ca2",
        ];          
     
        const result = await getAssetsByOwners(owners);
       const data = mergeAssetsByOwners(result);
        return data;
    }
};
