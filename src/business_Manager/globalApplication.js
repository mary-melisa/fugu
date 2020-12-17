import AccountManager from './account/accountManager';

class GlobalApplication {
    constructor() {
        this.uuid = ''; // 客户端设备号
        this.initBusiness();
    }

    initCoreManager() {
        this.accountManager = new AccountManager();
    }

    initBusiness() {
        this.accountManager = null; // 账户管理类
    }
    clearBusiness() {
        // 置空每个管理类
        this.initBusiness();
    }
}

const app = new GlobalApplication();
export default app;
