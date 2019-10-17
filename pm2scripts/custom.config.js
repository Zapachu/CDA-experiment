const apps = [
    {
        script: "../game/Custom/ShanghaiNY/V4/build/serve.js",
        name: "ShanghaiNYV4",
    },
    {
        script: "../game/Custom/ShanghaiNY/Bak/build/serve.js",
        name: "ShanghaiNYBak",
    },
    {
        script: "../game/Custom/SceneSurvey/build/serve.js",
        name: "SceneSurvey",
    },
    {
        script: "../game/Custom/DecisionSurvey/build/serve.js",
        name: "DecisionSurvey",
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
            BESPOKE_WITH_PROXY: "true",
            BESPOKE_WITH_LINKER: "true"
        }
    }))
};
