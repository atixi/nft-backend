'use strict';
const { sanitizeEntity } = require('strapi-utils');
const axios = require("axios")
const seaport = strapi.config.functions.openSeaApi.seaport();
module.exports = {
  async findOne(ctx) {
      const {id, address} = ctx.params;
            // return await axios.get("https://api.opensea.io/api/v1/asset///")
          // let {categories} = await strapi.services.nfts.findOne({id}/{address});

      const OpenSeaAsset = await seaport.api.getAsset({
          tokenAddress: address,
          tokenId: id
        })
    

         
        return OpenSeaAsset
      },

      
      // async find(ctx) {
      
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
