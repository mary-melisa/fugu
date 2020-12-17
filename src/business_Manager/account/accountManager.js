/**
 * 账户管理类
 */
import axios from 'axios';
export default class AccountManager {
    constructor() {
        this.taAccountInfo = {}; // 选中的资金账户信息，多个时默认第一个，可通过界面切换
    }

    /*
     * param	参数
     */
    getForgetPwd({ param }) {
        return new Promise((resolve, reject) => {
            axios({ method: 'get', url: param })
                .then(rsp => {
                    if (rsp.status == 200) {
                        if (rsp.data.code === '0') {
                            resolve(rsp);
                        } else {
                            reject(`${rsp.data.message}`);
                        }
                    } else {
                        reject('发送请求失败');
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
