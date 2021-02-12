<template>
 <el-dialog
  class="commonDialog"
  :title="'完善人脸'"
  :visible.sync="visible"
  width="400px"
  v-loading="loading"
  element-loading-text="加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  :close-on-click-modal="false"
  :append-to-body="true"
  :before-close="close">
    <div class="content">
       <el-upload
            ref="upload"
            accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp"
            :action="uploadUrl"
            :data="datas"
            name="UploadFile"
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            >
            <!-- <i class="el-icon-plus" v-if="imageUrl"></i> -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- <div class="delBar"  v-if="imageUrl" @click="delImg"><i class="el-icon-delete delIcon"></i></div> -->
        </el-upload>
    </div>    
    <div class="button">
        <el-button class="commonButton" @click.native="close">取消</el-button>
        <el-button class="commonButton" @click="makeSure" >确认</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible"  :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['getParentTableData', 'cancelModule', 'parentCurrentMeal', 'restaurantObj'],
    data() {
        return {
            loading: false,
            uploadUrl: window.$imgUrl,
            imgUrl: window.$imgUrlPrev,
            visible: false,
            datas: {},
            imageUrl: "",
            dialogImageUrl: '',
            dialogVisible: false,
            formData: new FormData()
        }
    },
    mounted(){
         this.visible = true;
         this.init();
    },
    methods: {
        init(){
            if(this.parentCurrentMeal.facePhotos){
                this.imageUrl= this.imgUrl + this.parentCurrentMeal.facePhotos;
            }
            this.datas.type = 1;
            if(this.parentCurrentMeal.id) {
                this.datas.userId = this.parentCurrentMeal.id;
            }
            if(this.parentCurrentMeal.userName) {
                 this.datas.userName = this.parentCurrentMeal.userName;
            }
            if(Object.keys(this.restaurantObj).length) { 
                this.datas.restaurantId = this.restaurantObj.id;
                this.datas.restaurantName = this.restaurantObj.name;
            }
            this.datas.FileName = 'renlian';
        },
        handleRemove(file, fileList) {
            this.$refs.upload.clearFiles();
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        close(){
            this.$emit('cancelModule');
        },
        handleChange(file, fileList) {
            console.log(file);
            if(file.name){
                this.imageUrl = URL.createObjectURL(file.raw);
                this.datas.UploadFile = file.raw;
            }
        },
        // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {

            this.loading = true;
            this.datas.sourcePath = this.parentCurrentMeal.facePhotos;
            this.imageUrl = "";
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
       
         //关闭弹框
        close() {
            this.$emit('cancelModule');
        },
        // 新增
        makeSure() {
                this.loading = true;
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                let formData = new FormData();
                if(Object.keys(this.datas).length) {
                    Object.keys(this.datas).forEach(key => {
                        formData.append(key, this.datas[key]);
                    })
                }
                axios.post(this.uploadUrl,formData,config).then(res=>{
                    this.loading = false;
                    if(res.data.status === 1) {
                        this.$message.closeAll();
                        this.$message({
                            message: '完善人脸成功！',
                            type: 'success'
                        })
                        this.$forceUpdate() //组件嵌套太深 无法自动更新 强制更新视图
                        this.$nextTick(() => {
                            this.$emit('getParentTableData');
                            this.close();
                        })
                    }
                }).catch(() => {
                    this.loading = false;
                })
        }
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep.commonDialog{  
        .el-dialog{
            min-height: 200px;
            .el-dialog__body{
                min-height: 100px;
                padding:10px 8px;
                .mt45{
                    margin-top: 27px;
                }
            }
        }
    }
    .content {
        width: 100%;
        padding: 20px 0;
        text-align: center;
    }
    .button {
        text-align: center;
    }
    .avatar-uploader-icon{
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
        .delIcon{
            font-size: 20px;
            color: red;
            line-height: 40px;
        }
    }
</style>