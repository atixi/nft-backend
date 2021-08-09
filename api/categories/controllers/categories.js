"use strict";
const seaport = strapi.config.functions.openSeaApi.seaport();
// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
//  * to customize this controller
//  */

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;
    const { limit, offset } = ctx.query;

    const knex = strapi.connections.default;
    const entity = await strapi.services.categories.findOne({ slug }, [
      "categories",
      "categoryImage",
      "categoryBanner",
    ]);

    const result = await knex("categories")
      .where("slug", slug)
      .join(
        "categories_nfts__nfts_categories",
        "categories.id",
        "categories_nfts__nfts_categories.category_id"
      )
      .join("nfts", "categories_nfts__nfts_categories.nft_id", "nfts.id")
      .join("talents", "nfts.talent", "talents.id")
      .select("categories.categoryName", "categories.slug")
      .select("talents.talentName", "talents.userName")
      .select("nfts.*")
      .limit(limit)
      .offset(offset);

    for (let i = 0; i < result.length; i++) {
      let res = await seaport.api.getAsset({
        tokenAddress: await result[i].tokenAddress,
        tokenId: await result[i].tokenId,
      });
      result[i]["currentPrice"] = await res.orders[0].currentPrice;
      result[i]["imageUrl"] = await res.imageUrl;
      result[i]["owner"] = {};
      result[i].owner["profile_img_url"] = await res.owner.profile_img_url;
    }

    return { ...entity, assets: [...result] };

    // let res = await seaport.api.getAsset({
    //   tokenAddress: await result[0].tokenAddress,
    //   tokenId: await result[0].tokenId,
    // });

    // return res;
  },
  async categorieslist(ctx) {
    const data = await strapi.services.categories.find();
    if (!data) {
      return {
        success: false,
        message: "Categories list is not available",
      };
    }
    const categoriesList = data.map((item) => {
      return {
        thumbnailUrl: item.categoryImage.formats.thumbnail.url,
        id: item.id,
        category: item.categoryName,
      };
    });
    return categoriesList;
  },
};
