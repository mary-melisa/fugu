import SessionUtil from '@/utils/applicationStorage/sessionStorageUtil';
import BMapGL from 'vue-baidu-map';
import Vue from 'vue';
import { JSEncrypt } from 'jsencrypt';

// //JSEncrypt加密方法
// Vue.prototype.$encryptedData = function(publicKey, data) {
//     //new一个对象
//     let encrypt = new JSEncrypt();
//     //设置公钥
//     encrypt.setPublicKey(publicKey);
//     //data是要加密的数据,此处不用注意+号,因为rsa自己本身已经base64转码了,不存在+,全部是二进制数据
//     let result = encrypt.encrypt(data);
//     debugger
//     return result;
// }

Vue.use(BMapGL, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'Dw09ZpZG9VGhwlzHjwMp5ogOuEx9uAFO',
});
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
            import(/*webpackChunkName:'familybucket'*/ 'axios')
                .then(axios => {
                    window.$config = null;
                    window.$config1 = null;
                    window.$config2 = null;
                    window.$imgUrl = null;
                    window.$imgUrlPrev = null;
                    window.$facilityUrl = null;
                    window.$moneyUrl = null; // 财务管理模块
                    window.$cardUrl = null; // 卡务管理模块
                    const that = this;
                    // 添加请求拦截器
                    axios.interceptors.request.use(function (config) {
                        config.headers['TimeSpan'] = new Date().getTime();
                        const publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoQh0wEqx/R2H1v00IU12Oc30fosRC/frhH89L6G+fzeaqI19MYQhEPMU13wpeqRONCUta+2iC1sgCNQ9qGGf19yGdZUfueaB1Nu9rdueQKXgVurGHJ+5N71UFm+OP1XcnFUCK4wT5d7ZIifXxuqLehP9Ts6sNjhVfa+yU+VjF5HoIe69OJEPo7OxRZcRTe17khc93Ic+PfyqswQJJlY/bgpcLJQnM+QuHmxNtF7/FpAx9YEQsShsGpVo7JaKgLo+s6AFoJ4QldQKir2vbN9vcKRbG3piElPilWDpjXQkOJZhUloh/jd7QrKFimZFldJ1r6Q59QYUyGKZARUe0KZpMQIDAQAB";
                        let rs = '';
                        let encryption = new JSEncrypt()
                        encryption.setPublicKey(publicKey);
                        //传递的参数都进行加密
                        if (config.data) {
                            rs = encryption.encrypt(config.data);
                        } else if (config.params) {
                            rs = encryption.encrypt(config.params);
                        }  
                        config.headers['aeskey'] = rs;
                        console.log(config);
                        // 在发送请求之前做些什么
                        return config;
                    }, function (error) {
                        // 对请求错误做些什么
                        return Promise.reject(error);
                    })
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
                    // axios.defaults.headers.post['Content-Type'] = 'application/json-patch+json';

                    Vue.prototype.$http = axios;
                    // 存储省市区JSON
                    axios.get('./config/address.json').then(res => {
                        window.$addressList = res.data;                    
                    });
                    return axios.get('./config/app.config.json');
                })
                .then(res => {
                    if (res.status === 200) {
                        window.$config = res.data.apiUrl;
                        window.$config1 = res.data.apiUrl1;
                        window.$config2 = res.data.apiUrl2;
                        window.$imgUrl = res.data.imgUrl;
                        window.$imgUrlPrev = res.data.imgUrlPrev;
                        window.$facilityUrl = res.data.facilityUrl;
                        window.$moneyUrl = res.data.moneyUrl;
                        window.$cardUrl = res.data.cardUrl;
                    }
                })
                .catch(err => {
                    throw err;
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

                //storage部分
                // Vue.prototype.resetSetItem = function (key, newVal) {
                //     if (key === 'userInfo') {
                //         // 创建一个StorageEvent事件
                //         var newStorageEvent = document.createEvent('userInfo');
                //         const storage = {
                //             setItem: function (k, val) {
                //                 localStorage.setItem(k, val);
                //                 // 初始化创建的事件
                //                 newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
                //                 // 派发对象
                //                 window.dispatchEvent(newStorageEvent)
                //             }
                //         }
                //         return storage.setItem(key, newVal);
                //     }
                // }

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

