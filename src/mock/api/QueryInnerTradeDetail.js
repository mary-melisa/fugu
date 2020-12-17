// import Mock from 'mockjs'; // 引入mockjs
// const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

const data = []; // 用于接受生成数据的数组

for (let i = 0; i < 10; i++) {
    // 可自定义生成的个数
    let template = {
        accountid: 0,
        agreeunit: 0,
        asapplyid: 0,
        asname: 'string',
        asno: 'string',
        buyorsell: 0,
        channelbuildtype: 0,
        closetype: 0,
        decimalplace: 0,
        detailtype: 0,
        exexchangecode: 'string',
        exexchangename: 'string',
        goodscode: 'string',
        goodsgroupid: 0,
        goodsgroupname: 'string',
        goodsid: 0,
        goodsname: 'string',
        goodunit: 'string',
        marketid: 0,
        orderid: 0,
        outgoodscode: 'string',
        relatedouttradeid: 0,
        remark: 'string',
        spotcontractid: 0,
        spotcontractno: 'string',
        tradeid: 0,
        tradeprice: 0,
        tradeqty: 0,
        tradetime: 'string',
    };
    data.push(template);
}

export { data };
