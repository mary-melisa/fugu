//路由
const router = {
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/login.vue'),
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/home/home.vue'),
            children: [
                {
                    //组织架构
                    path: '/organizational',
                    name: 'organizational',
                    component: () => import('@/views/organizational/organizational.vue'),
                },
                {
                    //营养成分
                    path: '/nutrients',
                    name: 'nutrients',
                    component: () => import('@/views/nutrients/nutrients.vue'),
                },
                {
                    //餐别设置
                    path: '/mealSetting',
                    name: 'mealSetting',
                    component: () => import('@/views/mealSetting/mealSetting.vue'),
                },
                {
                    path: '/facility',
                    name: 'facility',
                    component: () => import('@/views/facility/facility.vue'),
                },
            ],
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/test'),
        },
    ],
};

export default router;
