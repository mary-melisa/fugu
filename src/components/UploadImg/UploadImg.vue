<template>
    <div class="uploadImg">
        <el-upload ref="upload" class="avatar-uploader" accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp" :action="imgUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :limit="1" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imageUrl: '',
            imgUrl: window.$imgUrl,
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.$refs.upload.clearFiles();
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            const isLt10M = file.size / 1024 / 1024 < 10;

            let type = this.isImage(file.name);
            if (!type) {
                this.$message.error('只允许上传.jpg,.gif,.jpe,.jpeg,.png,.bmp图片');
                return false;
            }
            // if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            if (!isLt10M) {
                this.$message.error('上传头像图片大小不能超过 10MB!');
                return false;
            }
            return true;
        },
    },
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
