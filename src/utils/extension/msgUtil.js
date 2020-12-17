class MsgUtils {
    constructor() {}

    /**
     * 自定义析构函数
     */
    deallocObject() {}

    alertSuccess(vueObject, message, options) {
        // const h = vueObject.$createElement;
        let defaultOpt = {
            title: '提示',
            confirmButtonText: '确定',
            message: message,
            type: 'success',
            callback: () => {},
        };
        let opt = Object.assign(defaultOpt, options);

        vueObject.$alert('', opt);
    }

    alertWarning(vueObject, errorInfo, options) {
        const h = vueObject.$createElement;
        let defaultOpt = {
            title: '提示',
            confirmButtonText: '确定',
            message: h('p', null, [h('p', null, errorInfo.message), h('p', null, `代码：${errorInfo.code}`)]),
            type: 'warning',
            callback: () => {},
        };
        let opt = Object.assign(defaultOpt, options);

        vueObject.$alert('', opt);
    }

    alertError(vueObject, errorInfo, options) {
        const h = vueObject.$createElement;
        let defaultOpt = {
            title: '提示',
            confirmButtonText: '确定',
            message: h('p', null, [h('p', null, errorInfo.message), h('p', null, `代码：${errorInfo.code}`)]),
            type: 'error',
            callback: () => {},
        };
        let opt = Object.assign(defaultOpt, options);

        vueObject.$alert('', opt);
    }
}

const msgUtil = new MsgUtils();
export default msgUtil;
