const webpack = require('webpack');
const path = require('path');
// 判断生产环境
const isProd = process.env.NODE_ENV === 'production';
function resolveResource(name) {
    return path.resolve(__dirname, './src/assets/css/' + name);
}
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    runtimeCompiler: false,
    productionSourceMap: false,
    lintOnSave: isProd ? false : true,
    configureWebpack: config => {
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
        if (isProd) {
            // 生产环境
            // 编译时删除console.log
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.devtool = 'hidden-source-map';
        } else {
            config.devtool = 'cheap-module-eval-source-map';
        }
    },
    css: {
        extract: true,
        sourceMap: true,
        requireModuleExtension: true,
        loaderOptions: {
            // 这里的选项会传递给 css-loader
            css: {
                // 配置 CSS Modules 的class命名规则
                modules: {
                    localIdentName: '[local]_[hash:base64:8]',
                },
            },
            // sass: {
            //     prependData: '@import "@/assets/css/reset.scss";@import "@/assets/css/color.scss";@import "@/assets/css/mixin.scss";@import "@/assets/css/common.scss";@import "@/assets/css/index.scss";'
            // }
        },
    },

    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        oneOfsMap.forEach(item => {
            item.use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // 要公用的scss的路径
                    resources: [resolveResource('reset.scss'), resolveResource('color.scss'), resolveResource('mixin.scss'), resolveResource('common.scss')],
                })
                .end();
        });

        // 处理重新加载时候不加载WebWorker代码的问题
        // config.module.rule('js').exclude.add(/\.worker\.js$/);
        config.optimization.minimize(true);
        config.optimization.splitChunks({ chunks: 'all' });

        config.resolve.alias.set('@', path.resolve('src')).set('@assets', path.resolve('src/assets'));

        const imagesRule = config.module.rule('images');
        imagesRule.uses.clear();
        imagesRule
            .use('file-loader')
            .loader('url-loader')
            .options({
                limit: 10000,
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[hash:8].[ext]',
                    },
                },
            })
            .end();

        //压缩图片
        // if (isProd) {
        //     config.module
        //         .rule('images')
        //         .use('image-webpack-loader')
        //         .loader('image-webpack-loader')
        //         .options({
        //             bypassOnDebug: true,
        //         })
        //         .end();
        // }

        // config.module
        //     .rule('proto')
        //     .test(/\.(proto)(\?.*)?$/)
        //     .use('file-loader')
        //     .loader('file-loader')
        //     .options({
        //         fallback: {
        //             loader: 'file-loader',
        //             options: {
        //                 name: isProd ? '[hash].[ext]' : '[path][name].[ext]',
        //             },
        //         },
        //     })
        //     .end();

        // config.module
        //     .rule('worker')
        //     .test(/\.worker\.js$/)
        //     .use('worker-loader')
        //     .loader('worker-loader')
        //     .options({
        //         fallback: true,
        //     })
        //     .end();
    },

    devServer: {
        open: true,
        port: 3000,
        https: false,
        hotOnly: false,
        overlay: {
            warnings: true,
            errors: true,
        },
        //代理配置
        // proxy: {
        //     '/api': {
        //         target: 'https://m.kuaidi100.com/app/query/', //对应自己的接口
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    },

    pluginOptions: {
        'app-config': {
            file: './app.config.js',
            default: 'Enum',
        },
    },
};
