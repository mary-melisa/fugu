import { JSEncrypt } from 'jsencrypt';
export const RsaMixin = {
    methods: {
        //  加密
        encryptedData(publicKey, data) {
            // 新建JSEncrypt对象
            let encryptor = new JSEncrypt();
            // 设置公钥
            encryptor.setPublicKey(publicKey);
            // 加密数据
            return encryptor.encrypt(data);
        },
        // 解密
        decryptData(privateKey, secretWord) {
            // 新建JSEncrypt对象
            let decrypt = new JSEncrypt();
            // 设置私钥
            decrypt.setPrivateKey(privateKey);
            // 解密数据
            decrypt.decrypt(secretWord);
        },
    },
};
