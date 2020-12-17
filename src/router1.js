//路由
const router = {
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/login',
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
            // meta: {
            //     requireAuth: true,
            // },
            // children: [],
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/test'),
        },
        {
            path: '/organizational',
            name: 'organizational',
            component: () => import('@/views/organizational/organizational.vue'),
        },
    ],
};

export default router;
