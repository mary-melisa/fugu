import * as mathjs from 'mathjs';
/**
 * 计算辅助类
 */
class MathUtils {
    constructor() {
        mathjs.config({
            number: 'BigNumber',
        });
    }

    getRealQtySum(num1, num2) {
        let baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = String(num1).split('.')[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = String(num2).split('.')[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    }

    /**
     * 比较两个日期的大小 是否相差一月
     *   date1 第一个比较日期
     *   date2 第二个比较日期
     * @returns true Or false
     * @constructor
     */
    getCompareBTMonth(date1, date2) {
        let sDate = new Date(date1);
        let eDate = new Date(date2);
        if (eDate.getFullYear() - sDate.getFullYear() > 1) {
            //先比较年
            return true;
        } else if (eDate.getMonth() - sDate.getMonth() > 1) {
            //再比较月
            return true;
        } else if (eDate.getMonth() - sDate.getMonth() == 1) {
            if (eDate.getDate() - sDate.getDate() >= 1) {
                return true;
            }
        } else if (eDate.getFullYear() - sDate.getFullYear() == 1) {
            if (eDate.getMonth() + 12 - sDate.getMonth() > 1) {
                return true;
            } else if (eDate.getDate() - sDate.getDate() >= 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * 比较两个日期的大小 是否是同一个月
     *   date1 第一个比较日期
     *   date2 第二个比较日期
     * @returns true Or false
     * @constructor
     */
    getCompareIsSomeMonth(date1, date2) {
        let sDate = new Date(date1);
        let eDate = new Date(date2);
        if (eDate.getFullYear() - sDate.getFullYear() >= 1) {
            //先比较年
            return true;
        } else if (eDate.getMonth() - sDate.getMonth() >= 1) {
            //再比较月
            return true;
        }
        return false;
    }

    /**
     * 数字扩位变整数
     * value 需要扩位的数字
     * num 需要扩大的小数位数
     * @returns 整数
     */
    getIntegerNum(value, num) {
        let text = ``;
        try {
            text = `${value} * ${mathjs.pow(10, num)}`;
            let result = parseInt(mathjs.eval(text));
            return result;
        } catch (e) {
            console.error('扩位失败', e, { value, num, text });
            return 0;
        }
    }

    /**
     * 数字缩小变小数
     * value 需要缩小的数字
     * num 需要缩小的小数位数
     * @returns 整数
     */
    getDecimalsNum(value, num) {
        let text = ``;
        try {
            if (!value) {
                // 行情有神坑，价只判断第一个，后续都不判，所以会传错误值进来,这里将空值和undefined处理掉
                value = Number(value);
            }
            text = `${value} * ${mathjs.pow(mathjs.bignumber(0.1), num)}`;
            // let result = mathjs.format(mathjs.eval(text), num);
            let result = mathjs.eval(text).toString();
            return result;
        } catch (e) {
            console.error('缩位失败', e, { value, num, text });
            return 0;
        }
    }
}

const mathUtil = new MathUtils();
export default mathUtil;
