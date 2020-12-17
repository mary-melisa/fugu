//api使用参见:https://gitee.com/Ivorzk/vue-cli-plugin-app-config
module.exports = {
    // 不同环境环境配置
    // 使用不同的环境启动项目 eg: npm start --menu
    // 使用不同的环境编译项目 eg: npm build --menu
    // 使用:$config
    env: {
        Enum: {},
    },
    // 公用配置
    common: {
        // 接口超时时间
        timeout: 5000,
    },
};
