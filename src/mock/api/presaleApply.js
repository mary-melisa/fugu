import Mock from 'mockjs'; // 引入mockjs
const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

const data = []; // 用于接受生成数据的数组

for (let i = 0; i < 10; i++) {
    // 可自定义生成的个数
    let template = {
        accountid: Random.id(),
        applyid: Random.id(),
        applystatus: Random.integer(1, 8),
        applytime: Random.date(),
        attachmenturl: Random.url(),
        endtime: Random.date(),
        goodscode: Random.string(6),
        goodsname: Random.name(),
        goodunit: 'kg',
        handlestatus: Random.integer(1, 8),
        marketid: Random.id(),
        marketname: Random.name(),
        presaleqty: Random.integer(),
        relatedgoodscode: Random.string(6),
        relatedgoodsid: Random.id(),
        relatedgoodsname: Random.name(),
        starttime: Random.date(),
        tradedate: Random.date(),
        trademode: Random.string(6),
        userid: Random.id(),
    };
    data.push(template);
}

export { data };
