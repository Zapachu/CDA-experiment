const apps = [
  {
    script: "../game/CDA/CDASurvey/build/serve.js",
    name: "CDASurvey"
  },
  {
    script: "../game/CDA/CognitiveReaction/build/serve.js",
    name: "CognitiveReaction"
  },
  {
    script: "../game/CDA/ContinuousDoubleAuction/build/serve.js",
    name: "ContinuousDoubleAuction"
  },
  {
    script: "../game/CDA/EyeTest/build/serve.js",
    name: "EyeTest"
  },
  {
    script: "../game/CDA/ReactionTest/build/serve.js",
    name: "ReactionTest"
  }
];

module.exports = {
  apps: apps.map(app => ({
    ...app,
    autorestart: true,
    max_memory_restart: "1G",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    env: {
      NODE_ENV: "production",
      BESPOKE_WITH_PROXY: "true",
      BESPOKE_WITH_LINKER: "true"
    }
  }))
};
