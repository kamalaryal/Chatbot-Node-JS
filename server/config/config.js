module.exports = {
    JWT_SECRET: 'codeworkrauthentication',
    oauth: {
      facebook: {
        clientID: process.env.facebook_clientID,
        clientSecret: process.env.facebook_clientSecret
      }
    }
  };