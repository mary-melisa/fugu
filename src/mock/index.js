import Mock from 'mockjs'; // 引入mockjs

import * as FO from './api/forwardOrder';
import * as RS from './api/registerSearch';
import * as PA from './api/presaleApply';
import * as QT from './api/QueryInnerTradeDetail';

Mock.mock('/forwardOrder', 'get', FO.data);
Mock.mock('/registerSearch', 'get', RS.data);
Mock.mock('/presaleApply', 'get', PA.data);
Mock.mock('/QueryInnerTradeDetail', 'get', QT.data);
