class TimerUtils {
    constructor() {
        this.timeOutMap = new Map();
        this.intervalMap = new Map();
    }

    /**
     * 延迟执行函数
     *   callback 制定函数
     *   delay 延迟毫秒数
     *   code 指定别名
     */
    setTimeout(callback, delay, code) {
        if (Boolean(callback) && Boolean(delay)) {
            let timeoutId = 0;
            if (code) {
                timeoutId = window.setTimeout(callback, delay);
                this.timeOutMap.set(code, timeoutId);
            } else {
                timeoutId = window.setTimeout(callback, delay);
                this.timeOutMap.set(code, timeoutId);
            }
        }
    }

    /**
     * 立即执行函数
     *   callback 指定函数
     */
    setTimeoutInTime(callback) {
        if (callback) {
            window.setTimeout(callback, 0);
        }
    }

    /**
     * 指定周期执行
     *   callback 指定回调函数
     *   delay 间隔执行毫秒数
     *   code 指定别名
     */
    setInterval(callback, delay, code) {
        if (Boolean(callback) && Boolean(delay)) {
            let timeoutId = 0;
            if (code) {
                this.clearInterval(code);
                timeoutId = window.setInterval(callback, delay);
                this.intervalMap.set(code, timeoutId);
            } else {
                timeoutId = window.setInterval(callback, delay);
                this.intervalMap.set(code, timeoutId);
            }
        }
    }

    /**
     * 清除指定timeOut
     *   id   指定ID
     */
    clearTimeout(id) {
        if (Boolean(id) && this.timeOutMap.has(id)) {
            window.clearTimeout(this.timeOutMap.get(id));
            this.timeOutMap.delete(id);
        }
    }

    /**
     * 清除指定Interval
     *   id   指定ID
     */
    clearInterval(id) {
        if (Boolean(id) && this.intervalMap.has(id)) {
            window.clearInterval(this.intervalMap.get(id));
            this.intervalMap.delete(id);
        }
    }

    /**
     * 自定义析构函数
     */
    deallocObject() {
        if (Boolean(this.intervalMap) && this.intervalMap.size > 0) {
            this.intervalMap.forEach(x => {
                window.clearInterval(this.intervalMap.get(x));
            });
            this.intervalMap = new Map();
        }
        if (Boolean(this.timeOutMap) && this.timeOutMap.size > 0) {
            this.timeOutMap.forEach(x => {
                window.clearTimeout(this.timeOutMap.get(x));
            });
            this.timeOutMap = new Map();
        }
    }

    /**
     * 打印函数 辅助调试
     */
    print() {
        if (this.timeOutMap) {
            console.log(this.timeOutMap.size);
        }
        if (this.intervalMap) {
            console.log(this.intervalMap.size);
        }
    }
}

const timerUtil = new TimerUtils();
export default timerUtil;
