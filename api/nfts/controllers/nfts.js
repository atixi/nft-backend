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

const getAllAssets = async () => {
  const talents = await strapi.services.talents.find();

  let allAssets = [];
  try {
    await bluebird.map(
      talents,
      async (line) => {
        try {
          let { assets } = await bluebird.delay(2000).return(
            seaport.api.getAssets({
              owner: line.walletAddress,
            })
          );
          if (assets) {
            allAssets = [...allAssets, ...assets];
          }
          console.log("requet number", line.id);
        } catch (e) {
          console.log("error in getting asset of onwer", e);
        }
      },
      { concurrency: 1 }
    );
    return allAssets;
  } catch (e) {
    console.log("error in getting all assets", e);
  }
  return auctions;
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
    const data = await getAllAssets();
    // let owners = [];
    // const talents = await strapi.services.talents.find();
    // for (let talent in talents) {
    //   owners.push(talents[talent].walletAddress);
    // }
    // // return owners;
    // const result = await getAssetsByOwners(owners);
    // const data = mergeAssetsByOwners(result);
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
            if (orders && orders != null && orders.length > 0) {
              auctions = [...auctions, ...orders];
            }
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
