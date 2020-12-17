import Vue from 'vue';
const eventBus = new Vue();
const eventEnum = {
    ShowBottomPart: 'showBottomPart', // 控制首页下半部分是否显示；
    SearchGoods: 'searchGoods', // 搜索商品（控制滚动台跳转到指定商品）
    RefreshBtnAction: 'refreshBtnAction', // 刷新数据(新UI)
    LoadComplete: 'loadComplete', // 是否加载完成
    SelectAccount: 'selectAccount', // 资金账号选择
    EnterMarketChange: 'enterMarketChange', // 通道交易市场切换，用于处理商品搜索
    ShowTradeDiolog: 'showTradeDiolog', // 交易弹窗 （现货采购 点价委托 套保建仓委托）
};
export { eventBus, eventEnum };
