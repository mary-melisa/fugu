import Mock from 'mockjs'; // 引入mockjs
const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

const data = []; // 用于接受生成数据的数组

for (let i = 0; i < 10; i++) {
    // 可自定义生成的个数
    let template = {
        EnabledQty: Random.integer(1, 100),
        GoodsCode: Random.string(6),
        GoodsName: Random.name(),
        WRStandardCode: Random.string(6),
        WRStandardName: Random.name(),
        accountid: Random.id(),
        cancelqty: Random.integer(1, 100),
        curpresaleqty: Random.integer(1, 100),
        deliveryqty: Random.integer(1, 100),
        freezeamount: Random.integer(1, 100),
        goodsid: Random.id(),
        goodunit: 'kg',
        hasspotfreeze: Random.integer(0, 1),
        inqty: Random.integer(1, 100),
        marketid: Random.id(),
        presaledamount: Random.integer(),
        presaledqty: Random.integer(),
        userid: Random.id(),
        wrstandardid: Random.id(),
    };
    data.push(template);
}

export { data };
