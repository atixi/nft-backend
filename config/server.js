module.exports = ({ env }) => ({
  url: env("HEROKU_URL"),
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "48bd00fd3cad4aaef0a1e169ab45ac04"),
    },
  },
});
