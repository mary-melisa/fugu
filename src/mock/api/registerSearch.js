import Mock from 'mockjs'; // 引入mockjs
const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

const data = []; // 用于接受生成数据的数组

for (let i = 0; i < 10; i++) {
    // 可自定义生成的个数
    let template = {
        accountid: Random.id(),
        applystatus: Random.integer(1, 8),
        applytime: Random.date(),
        cancelid: Random.id(),
        cancelqty: 0,
        createtime: Random.date(),
        creatorid: Random.id(),
        creatorname: Random.name(),
        goodscode: Random.string(6),
        goodsid: Random.id(),
        goodsname: Random.name(),
        goodunit: 'kg',
        handlestatus: Random.integer(1, 8),
        marketid: Random.id(),
        marketname: Random.name(),
        tradedate: Random.date(),
        userid: Random.id(),
    };
    data.push(template);
}

export { data };
