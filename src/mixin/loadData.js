// 全局混入 刷新功能
import { eventBus, eventEnum } from '@/eventBus/eventBus.js';
let isLoadComplete = false;
export default {
    created() {
        // 刷新整个页面时候，需要等数据加载数据
        eventBus.$on(eventEnum.LoadComplete, () => {
            this.initData && this.initData();
            isLoadComplete = true;
        });
        // 刷新 按钮，局部刷新
        eventBus.$on(eventEnum.RefreshBtnAction, () => {
            this.initData && this.initData('refresh');
        });
        // 资金账号选择, 局部刷新
        eventBus.$on(eventEnum.SelectAccount, account => {
            this.swithAccount && this.swithAccount(account);
        });
    },
    mounted() {
        if (isLoadComplete) {
            this.initData && this.initData();
        }
    },
};
