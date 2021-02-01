import axios from 'axios';

// create an axios instance
const instance = axios.create({
    baseURL: '', // api的base_url
    //timeout: 5000 // request timeout
});

// const ok = "10000";

export const createAPI = (url, method, data) => {
    let config = {};
    if (method === 'get') {
        config.params = data;
    } else {
        config.data = data;
    }
    config.headers = {
        authentication: sessionStorage.getItem('token'),
    };
    return instance({
        url,
        method,
        ...config,
    });
};

export const createFormAPI = (url, method, data) => {
    let config = {};
    config.data = data;
    config.headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    config.responseType = 'json';
    config.transformRequest = [
        function(data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        },
    ];
    return instance({
        url,
        method,
        ...config,
    });
};
export const createImgAPI = (url, method, data) => {
    let config = {};
    config.data = data;
    config.headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    config.responseType = 'blob';
    config.transformRequest = [
        function(data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        },
    ];
    return instance({
        url,
        method,
        ...config,
    });
};
// 组织架构导出
export const createFileAPI = (url, method, data) => {
    let config = {};
    config.data = data;
    config.headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    config.responseType = 'arraybuffer';
    config.transformRequest = [
        function(data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        },
    ];
    return instance({
        url,
        method,
        ...config,
    });
};
// 员工导出
export const createDown = (url, method, data) => {
    let config = {};
    if (method === 'get') {
        config.params = data;
    } else {
        config.data = data;
    }
    config.headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    config.responseType = 'blob';
    return instance({
        url,
        method,
        ...config,
    });
};
