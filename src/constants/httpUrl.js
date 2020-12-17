export const URL = {
    // 产能预售
    QueryUserGoodsData: '/CPTrade/QueryUserGoodsData', // 查询远期订单信息
    QueryPositionCancel: '/CPTrade/QueryPositionCancel', // 查询远期订单注销申请信息
    QueryPreasleApply: '/CPTrade/QueryPreasleApply', // 查询产能预售申请信息
    QueryPresaleGoodsEx: '/CPTrade/QueryPresaleGoodsEx', // 查询产能预售商品扩展信息
    GetAllDeliveryGoods: '/WRTrade/GetAllDeliveryGoods', // 获取带仓单分类的种类信息
    QueryDeliveryRelation: '/Delivery/QueryDeliveryRelation', // 查询商品交割关系表
    QueryMyCPTradeGoods: '/CPTrade/QueryMyCPTradeGoods', // 查询我的预售信息
    QueryCPTradeMyBidInfos: '/CPTrade/QueryCPTradeMyBidInfos', // 查询产能预售我的出价信息
    QueryCPTradeOrderDetail: '/CPTrade/QueryCPTradeOrderDetail', // 查询产能预售委托单信息
    QueryArbitrageStrategy: '/Erms2/QueryArbitrageStrategy', // 查询期现套利策略表信息（指定资金账户、未结束的）
    QuerySpotContract: '/Erms2/QuerySpotContract', // 查询现货合同表信息（指定策略ID、未结束的）
    QueryInnerTradeDetail: '/Erms2/QueryInnerTradeDetail', //查询内部成交单信息
    QueryTraderMenu: '/Common/QueryTraderMenu', //查询菜单
    QueryTableDefine: '/Common/QueryTableDefine', //查询交易端列表头信息
    QueryTradePosition: '/Order/QueryTradePosition', //查询交易端列表头信息
    QueryTradeOrderDetail: '/Order/QueryTradeOrderDetail', //委托单据查询
    QueryTradeDetail: '/Order/QueryTradeDetail', //成交单据查询
    QueryUserInfo: '/User/QueryUserInfo', //获取用户信息
    QueryAmountLog: '/TaAccount/QueryAmountLog', //资金流水查询（当前）
    QueryHisAmountLog: '/TaAccount/QueryHisAmountLog', //资金流水查询（历史）

    QueryHisTradeDetail: '/Order/QueryHisTradeDetail', // 历史成交单查询（合约市场）
    QueryHisTradeOrderDetail: '/Order/QueryHisTradeOrderDetail', // 历史委托单查询请求（合约市场）

    //  尚志大宗
    QueryRecieptOrder: '/SZDZ/QueryRecieptOrder', // 点选挂牌委托单据查询（摘牌大厅）
    QueryUserReferNum: '/User/QueryUserReferNum', //获取用户邀请码
    QueryGoodsPickup: '/SZDZ/QueryGoodsPickup', // 商品提货单查询
    QueryConvertLog: '/SZDZ/QueryConvertLog', // 交易系统转换流水查询
    QueryConvertConfig: '/SZDZ/QueryConvertConfig', // 查询交易系统转换设置
    SearchWhite: '/SZDZ/SearchWhite', // 搜索白名单

    // 通用服务
    QueryNotice: '/Common/QueryNotice', // 通知公告系统消息查询
    NoticeReaded: '/Common/NoticeReaded', // 通知公告设置已读请求
    QueryTSData: '/History/QueryTSData', // 分时图数据查询
    GetAllEnums: '/Common/GetAllEnums', // 获取所有枚举信息

    // 用户信息
    GetUserAuthStatus: '/User/GetUserAuthStatus', // 获取用户实名认证状态

    //原理
    AddSpotContractApply: '/Erms3/AddSpotContractApply', // 新增现货合同申请
    QuerySpotContractDetail: '/Erms3/QuerySpotContractDetail', // 查询合同详细信息
    QuerySpotContractAppleForm: '/Erms3/QuerySpotContractAppleForm', // 查询合同申请表单数据
    QueryPendingAuditContract: '/Erms3/QueryPendingAuditContract', // 查询待审核合同
    QueryUserInfoApplies: '/Erms3/QueryUserInfoApplies', // 客户申请信息查询
    AddUserInfoApply: '/Erms3/AddUserInfoApply', // 新增客户申请
    QueryUserInfos: '/Erms3/QueryUserInfos', // 新增客户申请
    QueryBusinessInfo: '/Erms3/QueryBusinessInfo', // 查询业务表单数据
    QueryPendingBusiness: '/Erms3/QueryPendingBusiness', // 查询待审核基差贸易业务
};
