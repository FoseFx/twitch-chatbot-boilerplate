function sampleEnv(p) {
  p.env.HOST = 'http://localhost:3000';
  p.env.PORT = 8080;
  p.env.TWITCH_CLIENT_ID = 'xxxxxxxxxxxx';
  p.env.TWITCH_CLIENT_SECRET = 'xxxxxxxxxxx';
}

module.exports = { sampleEnv };
