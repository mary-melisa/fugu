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
                    //设备列表
                    path: '/facility',
                    name: 'facility',
                    component: () => import('@/views/facility/facility.vue'),
                },
                {
                    //保养记录
                    path: '/maintenanceRecord',
                    name: 'maintenanceRecord',
                    component: () => import('@/views/maintenanceRecord/maintenanceRecord.vue'),
                },
                {
                    //运行日志
                    path: '/runninglog',
                    name: 'runninglog',
                    component: () => import('@/views/runninglog/runninglog.vue'),
                },
                {
                    //用户管理
                    path: '/userManagement',
                    name: 'userManagement',
                    component: () => import('@/views/userManagement/userManagement.vue'),
                },
                {
                    //规则配置
                    path: '/ruleConfiguration',
                    name: 'ruleConfiguration',
                    component: () => import('@/views/ruleConfiguration/ruleConfiguration.vue'),
                },
                {
                    //菜单管理
                    path: '/menuManagement',
                    name: 'menuManagement',
                    component: () => import('@/views/menuManagement/menuManagement.vue'),
                },
                {
                    //菜品评价
                    path: '/dishEvaluation',
                    name: 'dishEvaluation',
                    component: () => import('@/views/dishEvaluation/dishEvaluation.vue'),
                },
                {
                    //意见反馈
                    path: '/feedback',
                    name: 'feedback',
                    component: () => import('@/views/feedback/feedback.vue'),
                },
                {
                    //消费记录
                    path: '/recConsumption',
                    name: 'recConsumption',
                    component: () => import('@/views/recConsumption/recConsumption.vue'),
                },
                {
                    //账户信息
                    path: '/memManagement',
                    name: 'memManagement',
                    component: () => import('@/views/memManagement/memManagement.vue'),
                },
                {
                    //会员数据
                    path: '/memberData',
                    name: 'memberData',
                    component: () => import('@/views/memberData/memberData.vue'),
                },
                {
                    //餐卡管理
                    path: '/mealCard',
                    name: 'mealCard',
                    component: () => import('@/views/mealCard/mealCard.vue'),
                },
                {
                    //餐卡类别
                    path: '/cardType',
                    name: 'cardType',
                    component: () => import('@/views/cardType/cardType.vue'),
                },
                {
                    //餐卡维护
                    path: '/cardMaintenance',
                    name: 'cardMaintenance',
                    component: () => import('@/views/cardMaintenance/cardMaintenance.vue'),
                },
                {
                    //冲红记录
                    path: '/redRecord',
                    name: 'redRecord',
                    component: () => import('@/views/redRecord/redRecord.vue'),
                },
                {
                    //充值记录
                    path: '/rechargeRecord',
                    name: 'rechargeRecord',
                    component: () => import('@/views/rechargeRecord/rechargeRecord.vue'),
                },
                {
                    //订单管理
                    path: '/orderManagement',
                    name: 'orderManagement',
                    component: () => import('@/views/orderManagement/orderManagement.vue'),
                },
                {
                    //结算管理
                    path: '/setManagement',
                    name: 'setManagement',
                    component: () => import('@/views/setManagement/setManagement.vue'),
                },
                {
                    //预定管理
                    path: '/reservationManage',
                    name: 'reservationManage',
                    component: () => import('@/views/reservationManage/reservationManage.vue'),
                },
                {
                    //备菜计划
                    path: '/dishPreparation',
                    name: 'dishPreparation',
                    component: () => import('@/views/dishPreparation/dishPreparation.vue'),
                },
                {
                    //套餐管理
                    path: '/packageManagement',
                    name: 'packageManagement',
                    component: () => import('@/views/packageManagement/packageManagement.vue'),
                },
                {
                    //菜品管理
                    path: '/dishManagement',
                    name: 'dishManagement',
                    component: () => import('@/views/dishManagement/dishManagement.vue'),
                },
                {
                    //营业数据
                    path: '/businessData',
                    name: 'businessData',
                    component: () => import('@/views/businessData/businessData.vue'),
                },
                {
                    //会员数据
                    path: '/membershipData',
                    name: 'membershipData',
                    component: () => import('@/views/membershipData/membershipData.vue'),
                },
                {
                    //菜品数据
                    path: '/dishData',
                    name: 'dishData',
                    component: () => import('@/views/dishData/dishData.vue'),
                },
                {
                    //充值数据
                    path: '/rechargeData',
                    name: 'rechargeData',
                    component: () => import('@/views/rechargeData/rechargeData.vue'),
                },
                {
                    //正在建设中
                    path: '/building',
                    name: 'building',
                    component: () => import('@/views/building/building.vue'),
                },
                {
                    //404
                    path: '/nopage',
                    name: 'nopage',
                    component: () => import('@/views/404/404.vue'),
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
