"use strict";

const { default: axios } = require("axios");
const seaport = strapi.config.functions.openSeaApi.seaport();
// import axios from "axios";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;
    const entity = await strapi.services.collections.findOne({ slug });
    // const entity = await axios.get(
    //   `https://api.opensea.io/api/v1/assets?collection=${slug}`
    // );
    const { assets } = await seaport.api.getAssets({
      collection: slug,
      limit: 50,
    });
    const onsales = await seaport.api.get("/events", {
      collection_slug: slug,
      event_type: "successful",
      limit: 50,
    });
    // const entity = `https://api.opensea.io/api/v1/assets?collection=${slug}`;
    return { ...entity, assets, onsales };
    // return sanitizeEntity(entity, { model: strapi.models.collections });
  },
};
