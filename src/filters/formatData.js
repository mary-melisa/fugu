 // 格式化业务模式
 const formatModule = (value) => {
    if(value == 1) {
        return 'AI智能模式';
    } else if(value == 2) {
        return 'RFID智盘';
    } else if(value == 3){
        return '人脸识别自助';
    }
    return "";
};

export { formatModule };