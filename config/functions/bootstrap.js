"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = () => {
  var io = require("socket.io")(strapi.server, {
    cors: {
      // origin: "http://localhost:3000",
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: false,
    },
  });

  var users = [];
  io.on("connection", (socket) => {
    socket.user_id = Math.random() * 100000000000000; // not so secure

    socket.on("disconnect", () => {});
    socket.on("newCollection", () => {
      console.log("event from client");
    });
    socket.on("userCreatedNewFixedSell", (data) => {
      strapi.serverBroadCastNewFixedSell(data);
    });
    socket.on("newERC721Created", () => {
      console.log("newERC721 event from client");
    });
  });

  strapi.io = io;

  strapi.serverBroadCastNewFixedSell = (fixed) => {
    io.emit("serverBroadCaseNewFixedPriceSell", fixed);
  };
  strapi.serverBroadCastNewCollection = (collection) => {
    io.emit("serverBroadCastNewCollection", collection);
  };
  strapi.serverBroadCastNewERC721 = (collection) => {
    console.log("ERC721 Create Event Emited");
    io.emit("serverBroadCastNewERC721", collection);
  };
};
