'use strict';
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
        let owners=[];
        const talents = await strapi.services.talents.find();    
        for(let talent in talents)
        {
          owners.push(talents[talent].walletAddress);
        }
        // return owners;
        const result = await getAssetsByOwners(owners);
       const data = mergeAssetsByOwners(result);
        return data;
    },
    async findAuction(ctx) {
      const { orders } = await seaport.api.getOrders(
        {
          is_expired: false,
          // sale_kind: 2
        }
        // {
        // asset_contract_address: address,
        // token_id: id,
        // side: 1
        // }
      )
      return orders
    },
};
