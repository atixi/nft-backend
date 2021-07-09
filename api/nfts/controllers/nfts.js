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
      
      //   // if (ctx.query._q) {
      //   //   entities = await strapi.services.nft.search(ctx.query);
      //   // } else {
      //     // return "dfs"
      //     // let data;
      //     // let newData;
      //     // let dataToSend;
      //     // data  = await strapi.services.nfts.find();
      //     // // return  entities;
      //     // data.map( async (order) => {
      //       // return await axios.get("https://api.opensea.io/api/v1/asset/0x495f947276749ce646f68ac8c248420045cb7b5e/9870243454359818837048173191911104292730407279767673233444380235657864282113/")
      //       return await seaport.api.getOrders({
      //         asset_contract_address: "0x495f947276749ce646f68ac8c248420045cb7b5e",
      //         token_id: "9870243454359818837048173191911104292730407279767673233444380235657864282113",
      //         side: 1
      //       })         
      //       // dataToSend = orders;
      //       // dataToSend = orders.tokenAddress
      //   //    })
      //   // return dataToSend;
      //   // }
      //   // return entities;
      //   // const { orders, count } = await seaport.api.getOrders({
      //   //   asset_contract_address: tokenAddress,
      //   //   token_id: token_id,
      //   //   side: OrderSide.Buy
      //   // })
      //   // return orders;
      //   // return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.nft }));
      // },
};
