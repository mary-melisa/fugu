/**
 * Created by Muchinfo
 * 专用于日志打印的工具类
 */
import Moment from 'moment';

class LogUtil {
    /**
     * 打印日志的内部方法
     *   logString 日志内容
     *   type      日志类型
     */
    writeLog(logString, type) {
        if (type === 'log') {
            //console.log(Moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '   :   ' + (typeof logString === 'object' ? logString.stack : logString));
        } else if (type === 'warn') {
            //console.warn(Moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '   :   ' + (typeof logString === 'object' ? logString.stack : logString));
        } else {
            //console.error(Moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '   :   ' + (typeof logString === 'object' ? logString.stack : logString));
        }
    }

    /**
     * 打印消息类日志的方法
     *   logString 日志内容
     */
    printLog(logString) {
        this.writeLog(logString, 'log');
    }

    /**
     * 打印警告类日志的方法
     *   warnString    日志内容
     */
    printWarn(warnString) {
        this.writeLog(warnString, 'warn');
    }

    /**
     * 打印错误类日志的方法
     *   errorString   日志内容
     */
    printError(errorString) {
        this.writeLog(errorString, 'error');
    }

    /**
     * 打印提示类日志的方法
     *   errorString   日志内容
     */
    log(obj) {
        if (window.$write$log$) {
            if (obj) {
                if (window.$log$type$) {
                    if (window.$log$type$ === 'all' || window.$log$type$.indexOf(obj.logType) > -1) {
                        let msg = obj.msg || '';
                        let type = obj.type || 'debug';
                        let flag = obj.data === undefined || obj.data === null || obj.data === '';
                        let message = Moment().format('YYYY-MM-DD HH:mm:ss.SSS') + '  :  ' + msg;
                        switch (type) {
                            case 'info':
                                flag ? console.log(message) : console.log(message, obj.data);
                                break;
                            case 'debug':
                                flag ? console.debug(message) : console.debug(message, obj.data);
                                break;
                            case 'error':
                                flag ? console.error(message) : console.error(message, obj.data);
                                break;
                        }
                    }
                }
            }
        }
    }
}

const logUtil = new LogUtil();
export default logUtil;
