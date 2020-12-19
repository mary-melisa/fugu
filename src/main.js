import SessionUtil from '@/utils/applicationStorage/sessionStorageUtil';

import(/*webpackChunkName:'familybucket'*/ 'vue')
    .then(({ default: Vue }) => {
        Promise.all([
            /**
             * ====魔法注释分包按需加载====
             * 项目文件打包文件:projectDoc
             * 全家桶打包文件:familybucket
             * 插件打包文件:thirdpartyint
             * css汇总打包文件:smallfilescss
             */

            // JS分包

            import(/*webpackChunkName:'projectDoc'*/ './App'),
            import(/*webpackChunkName:'projectDoc'*/ './filters'),
            import(/*webpackChunkName:'familybucket'*/ 'vue-router'),
            import(/*webpackChunkName:'familybucket'*/ './router.js'),
            import(/*webpackChunkName:'familybucket'*/ 'vuex'),
            import(/*webpackChunkName:'vuexjs'*/ './store'),
            import(/*webpackChunkName:'familybucket'*/ 'axios').then(axios => {
                window.$config = null;
                console.log('1111');
                // 配置在这里，确保拦截相应只执行一次（遇到过配置在business，请求前面配置，相应会执行两次，导致错误返回引发bug）
                axios.interceptors.response.use(
                    function(response) {
                        // 对响应数据做点什么
                        return response;
                    },
                    function(error) {
                        // 对响应错误做点什么
                        return Promise.reject(error);
                    },
                );
                axios.defaults.headers.post['Content-Type'] = 'application/json-patch+json';

                Vue.prototype.$http = axios;
            }),
            import(/*webpackChunkName:'familybucket'*/ 'element-ui').then(({ default: ElementUI }) => {
                Vue.use(ElementUI);
            }),
            // import(/*webpackChunkName:'projectDoc'*/ './directive'),
            import(/*webpackChunkName:'thirdpartyint'*/ 'default-passive-events'),
            // import(/*webpackChunkName:'thirdpartyint'*/ './mock/index.js'),

            // CSS分包
            import(/*webpackChunkName:'smallfilescss'*/ 'element-ui/lib/theme-chalk/index.css'),
            import(/*webpackChunkName:'smallfilescss'*/ './assets/css/fonts/iconfont.css'),
            import(/*webpackChunkName:'smallfilescss'*/ './assets/css/index.scss'),
        ])
            .then(res => {
                //拿到需要的数据
                const [{ default: App }, filters, { default: VueRouter }, { default: routerConfig }, { default: Vuex }, { default: storeConfig }] = res;

                //VueRouter 部分
                const routerPush = VueRouter.prototype.push;
                VueRouter.prototype.push = function push(location) {
                    return routerPush.call(this, location).catch(error => error);
                };
                Vue.use(VueRouter);

                const router = new VueRouter(routerConfig);
                router.beforeEach((to, from, next) => {
                    //路由拦截
                    if (to.meta.requireAuth) {
                        let loginToken = SessionUtil.getItem('__loginToken__');
                        if (loginToken) {
                            next();
                        } else {
                            next('/');
                        }
                    } else {
                        next();
                    }
                });

                //Store部分
                //Vuex.Store.prototype.$http = axios;
                Vue.use(Vuex);
                const store = new Vuex.Store(storeConfig);

                //其它需要部分
                Vue.config.productionTip = false; //阻止显示生产模式的消息
                Object.keys(filters).forEach(key => {
                    Vue.filter(key, filters[key]);
                });
                //实例化
                new Vue({ router, store, render: h => h(App) }).$mount('#app');
            })
            .catch(err => {
                throw err;
            });
    })
    .catch(err => {
        console.error(err);
    });
