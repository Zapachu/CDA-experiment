const apps = [
    {
        script: "../packages/gameTrial/build/app.js",
        name: "gameTrial",
    },
    {
        script: "../game/WithEgret/DoubleAuction/build/serve.js",
        name: "EgretDoubleAuction",
    },
    {
        script: "../game/Trial/ParallelApplication/build/serve.js",
        name: "ParallelApplication",
    },
    {
        script: "../game/Trial/GarbageSorting/V1/build/serve.js",
        name: "GarbageSorting",
    },
    {
        script: "../game/Trial/GarbageSorting/V2/build/serve.js",
        name: "GarbageSortingV2",
    }
];

module.exports = {
    apps: apps.map(app => ({
        ...app,
        autorestart: true,
        watch: true,
        max_memory_restart: '1G',
        log_date_format: "YYYY-MM-DD HH:mm Z",
        env: {
            NODE_ENV: "production",
            BESPOKE_WITH_PROXY: "true"
        }
    }))
};
