const apps = [
    {
        script: "../game/Classic/AdjustMatch/build/serve.js",
        name: "AdjustMatch"
    },
    {
        script: "../game/Classic/CallAuction/build/serve.js",
        name: "CallAuction"
    },
    {
        script: "../game/Classic/DelayReceiveMatch/build/serve.js",
        name: "DelayReceiveMatch"
    },
    {
        script: "../game/Classic/DoubleAuction/build/serve.js",
        name: "DoubleAuction"
    },
    {
        script: "../game/Classic/GoodExchange/build/serve.js",
        name: "GoodExchange"
    },
    {
        script: "../game/Classic/PublicGoods/build/serve.js",
        name: "PublicGoods"
    },
    {
        script: "../game/Classic/PublicGoodsWithRewardPunish/build/serve.js",
        name: "PublicGoodsWithRewardPunish"
    },
    {
        script: "../game/Classic/RiskPreferenceTest/build/serve.js",
        name: "RiskPreferenceTest"
    },
    {
        script: "../game/Classic/TragedyOfTheCommons/build/serve.js",
        name: "TragedyOfTheCommons"
    },
    {
        script: "../game/Classic/TTCMatch/build/serve.js",
        name: "TTCMatch"
    },
];

module.exports = {
    apps: apps.map(app => ({
        ...app,
        watch: true,
        max_memory_restart: '1G',
        log_date_format: "YYYY-MM-DD HH:mm Z",
        env: {
            NODE_ENV: "production",
            BESPOKE_WITH_PROXY: "true",
            BESPOKE_WITH_LINKER: "true"
        }
    }))
};
