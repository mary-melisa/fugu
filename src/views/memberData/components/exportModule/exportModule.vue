<template>
    <el-dialog class="commonDialog miniDialog" width="400px" title="导入" align="center" :visible.sync="visible" :before-close="close" :close-on-click-modal="false">
    <el-upload
        ref="upload"
        class="avatar-uploader"
        accept=".xls,.xlsx"
        action=""
        :on-change="handleChange"
        :on-remove="removeFiles"
        :limit="1"
        :auto-upload="false">
        <el-button size="small" v-if="!uploadUrl">选择文件</el-button>
        <span slot="tip" class="el-upload__tip" v-if="!uploadUrl">未选择任何文件</span>
    </el-upload>
    <div class="button">
        <el-button class="commonButton" @click="makeSure" >确认</el-button>
    </div>
    <div class="guide">没有任务模板？请点击<a @click="download">下载导入模板</a></div>
</el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
export default {
    props: ['getTableData', 'parentClo', 'restaurantObj'],
    data() {
        return {
            visible: true,
            uploadUrl: '',
            excelfile: null,
            formData: null,
        }
    },
    mounted(){

    },
    methods: {
        close(){
            this.$emit('parentClo');
        },
        removeFiles(){
            this.$refs.upload.clearFiles();
            this.uploadUrl = '';
        },
        // 会员导入
        makeSure(){
            this.formData.append('restaurantid', this.restaurantObj.id);
            const url = window.$moneyUrl + `api/member/importmember`;
            axios({ method: 'post', url: url, data: this.formData })
            .then(rsp=>{
               if (rsp.data.status == 1) {
                    this.$message({
                        message: '导入成功！',
                        type: 'success',
                    });
                    this.$emit('getTableData');
                    this.$emit('parentClo');
                } else if(rsp.data.message){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
        },
        handleChange(file, fileList) {
            this.uploadUrl = file.name;
            this.formData = new FormData();
            this.formData.append('excelfile',file.raw);
        },
        download(){
            const url = window.$moneyUrl + `api/member/exporttemplate`;
            axios({ method: 'post', url: url, responseType: 'blob' })
            .then(rsp=>{
                let elink = document.createElement('a');
                elink.download = "会员数据导入模板.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => console.log(err));
        }    
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep.commonRow.el-row {
        border-bottom: 0;
        .el-col:first-child {
            justify-content: flex-end;
        }
    }
    .avatar-uploader {
        display: inline-flex;
    }
    .el-upload__tip {
        margin-left: 15px;
        display: inline-block;
        line-height: 32px;
        height: 32px;
    }
    .guide {
        margin-top: 50px;
        width: 100%;
        height: 30px;
        text-align: right;
        font-size: 12px;
        color: black;
        a {
            margin-left: 10px;
            display: inline-block;
            font-size: 12px;
            color: blue;
            cursor: pointer;
        }
    }
    ::v-deep.avatar-uploader {
        .el-upload {
            border-color: transparent;
        }
    }
</style>