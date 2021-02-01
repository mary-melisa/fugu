import moment from 'moment';

//日期部分处理
const formatDate = (val, format) => {
    if (!val) return '--';
    let fmt = format || 'YYYY-MM-DD HH:mm:ss';
    return moment(val).format(fmt);
};

//日期部分处理
const formatDate_date = (val, format) => {
    if (!val) return '--';
    let fmt = format || 'YYYY-MM-DD';
    return moment(val).format(fmt);
};

export { formatDate, formatDate_date };
