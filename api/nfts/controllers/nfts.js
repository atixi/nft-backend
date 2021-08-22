"use strict";
const seaport = strapi.config.functions.openSeaApi.seaport();
const OrderSide = "opensea-js/lib/types";
const bluebird = require("bluebird");

const getAssetsByOwner = (owner) => {
  return seaport.api.getAssets({
    owner,
    limit: 40,
  });
};
const getAssetsByOwners = async (owners) => {
  const promises = [];
  for (let i = 0; i < owners.length; i++) {
    const data = await getAssetsByOwner(owners[i]);
    promises.push(data);
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
    const { id, address } = ctx.params;
    try {
      const OpenSeaAsset = await seaport.api.getAsset({
        tokenAddress: address,
        tokenId: id,
      });
      return OpenSeaAsset;
    } catch (e) {
      return null;
    }
  },

  async find(ctx) {
    let owners = [];
    const talents = await strapi.services.talents.find();
    for (let talent in talents) {
      owners.push(talents[talent].walletAddress);
    }
    // return owners;
    const result = await getAssetsByOwners(owners);
    const data = mergeAssetsByOwners(result);
    return data;
  },
  async findAuction(ctx) {
    const talents = await strapi.services.talents.find();
    let auctions = [];
    try {
      await bluebird.map(
        talents,
        async (line) => {
          try {
            let { orders } = await bluebird.delay(2000).return(
              seaport.api.getOrders({
                owner: line.walletAddress,
                is_expired: false,
                sale_kind: 2,
              })
            );
            auctions = [...auctions, ...orders];
            console.log("first promise is sent", line.id);
          } catch (e) {
            console.log("error in auction ", e);
          }
        },
        { concurrency: 1 }
      );

      return auctions;
    } catch (e) {
      console.log("error in all auction ", e);
    }
    return auctions;
  },
  async getBundledOrder(ctx) {
    try {
      const { maker, slug } = ctx.params;
      const { orders } = await seaport.api.getOrders({
        is_expired: false,
        maker: maker,
        side: 1,
        // sale_kind: 2
      });
      let bundle;
      orders.map((order) => {
        if (order.assetBundle) {
          console.log(order);
          if (order.assetBundle.slug == slug) {
            bundle = order;
          }
        }
      });
      return bundle;
    } catch (e) {
      return e;
    }
  },
  async nfts(ctx) {
    const nfts = await strapi.services.nfts.find(ctx.query);
    return nfts;
  },
  async nftsList() {
    return await strapi.services.nfts.find();
  },
};
