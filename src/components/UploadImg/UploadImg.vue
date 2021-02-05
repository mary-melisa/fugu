<template>
    <div class="uploadImg">
        <el-upload ref="upload" accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp" :action="uploadUrl" :data="datas" name="UploadFile" class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="delBar" v-if="imageUrl"><i class="el-icon-delete delIcon"></i></div>
        </el-upload>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: ['loading', 'parentLoad', 'datas', 'setPhotos'],
    data() {
        return {
            uploadUrl: window.$imgUrl,
            imgUrl: window.$imgUrlPrev,
            imageUrl: '',
            dialogImageUrl: '',
            dialogVisible: false,
            formData: new FormData(),
        };
    },
    mounted() {
        // this.initImage();
    },
    methods: {
        // initImage() {
        //     if (Reflect.has(this.datas, 'sourcePath')) {
        //         this.$nextTick(() => {
        //             this.imageUrl = this.datas.sourcePath;
        //         });
        //         debugger;
        //     }
        // },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.$refs.upload.clearFiles();
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        close() {
            this.$emit('cancelModule');
        },
        handleChange(file) {
            console.log(file);
            if (file.name) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.datas.UploadFile = file.raw;
            }
            this.makeSure();
        },
        // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {
            // this.datas.sourcePath = this.datas.sourcePath;
            this.imageUrl = '';
            const isLt10M = file.size / 1024 / 1024 < 10;

            let type = this.isImage(file.name);
            this.$message.closeAll();
            if (!type) {
                this.$message.error('只允许上传.jpg,.gif,.jpe,.jpeg,.png,.bmp图片');
                return false;
            }
            if (!isLt10M) {
                this.$message.error('上传头像图片大小不能超过 10MB!');
                return false;
            }
            return true;
        },
        // 新增
        makeSure() {
            this.$emit('setLoading', true);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            let formData = new FormData();
            if (Object.keys(this.datas).length) {
                Object.keys(this.datas).forEach(key => {
                    formData.append(key, this.datas[key]);
                });
            }
            let that = this;
            axios
                .post(this.uploadUrl, formData, config)
                .then(res => {
                    that.$emit('setLoading', false);
                    that.$emit('setPhotos', that.imgUrl + res.data.result);
                    if (res.data.status === 1) {
                        // this.$message.closeAll();
                        // this.$message({
                        //     message: '上传成功！',
                        //     type: 'success',
                        // });
                        this.$forceUpdate(); //组件嵌套太深 无法自动更新 强制更新视图
                        this.$emit('parentLoad');
                        this.close();
                    }
                })
                .catch(() => {
                    that.$emit('setLoading', false);
                });
        },
    },
    watch: {
        datas: {
            handler(newValue) {
                debugger
                if(Reflect.has(newValue, 'sourcePath')){
                    this.imageUrl = newValue['sourcePath'];
                }
            },
            deep: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.avatar-uploader-icon {
    width: 178px;
    height: 178px;
    line-height: 178px;
}
.delBar {
    width: 40px;
    height: 40px;
    text-align: center;
    cursor: pointer;
    @include position(absolute, 0, 0, auto, auto);
    z-index: 10;
    .delIcon {
        font-size: 20px;
        color: red;
        line-height: 40px;
    }
}
</style>
