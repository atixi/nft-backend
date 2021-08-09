module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "strapi"),
        username: env("DATABASE_USERNAME", "postgres"),
        password: env("DATABASE_PASSWORD", "ajoajo2245"),
        ssl: env.bool("DATABASE_SSL", false),
        ssl: {
          rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false), // For self-signed certificates
        },
      },
      options: {
        ssl: true,
      },
    },
  },
});

// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "bookshelf",
//       settings: {
//         client: "sqlite",
//         filename: env("DATABASE_FILENAME", ".tmp/data.db"),
//       },
//       options: {
//         useNullAsDefault: true,
//       },
//     },
//   },
// });
