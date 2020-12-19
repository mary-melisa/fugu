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
                    //角色管理
                    path: '/userManage',
                    name: 'userManage',
                    component: () => import('@/views/userManage/userManage.vue'),
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
                    //物料类别
                    path: '/matCategory',
                    name: 'matCategory',
                    component: () => import('@/views/matCategory/matCategory.vue'),
                },
                {
                    //物料信息
                    path: '/matInformation',
                    name: 'matInformation',
                    component: () => import('@/views/matInformation/matInformation.vue'),
                },
                {
                    //用户类型
                    path: '/customerType',
                    name: 'customerType',
                    component: () => import('@/views/customerType/customerType.vue'),
                },
                {
                    //设备类型
                    path: '/equipmentType',
                    name: 'equipmentType',
                    component: () => import('@/views/equipmentType/equipmentType.vue'),
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
