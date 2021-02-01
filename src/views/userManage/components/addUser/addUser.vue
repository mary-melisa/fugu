<template>
 <el-dialog
  class="commonDialog"
  :title="parentTitle === 1 ? '新增角色' : '编辑角色'"
  :visible.sync="visible"
  width="400px"
  :before-close="cancelModule">
        <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="35%">
            <el-form-item label="角色名称:" prop="name" required>
                <el-input class="commonInput" v-model="addMeal.name" ></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark" >
                 <el-input type="textarea" class="commonTextarea" v-model="addMeal.remark"></el-input>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item class="btnsLine mt60">
                <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" @click.prevent="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
                <el-button class="commonButton" @click.prevent="submitEditForm('addMeal')" v-if="parentTitle === 2">确定</el-button>
            </el-form-item>
        </el-form>
</el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import { formatDate } from '@/filters/index';
export default {
    props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal'],
    data() {
        return {
            visible: false,
            addMeal: {
                name: '',
                remark: '',
            },
            // datas: {
            //     fileName: 'caiwu'
            // },
            // imageUrl: '',
            // imageAddress: '',
            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ]
            },
        }
    },
    mounted(){
         this.visible = true;
         if(this.parentTitle === 2) {
             this.initFormData();
         }
    },
    methods: {
        // 编辑初始化表单
        initFormData(){
            this.addMeal = JSON.parse(JSON.stringify(this.parentCurrentMeal));
        },
         //关闭弹框
        cancelModule(val) {
            this.$emit('cancelModule', val);
        },
        // 新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.mealSave();
            } else {
                console.log('提交错误!');
                return false;
            }
            });
        },
        // 编辑
         submitEditForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.mealEdit();
            } else {
                console.log('提交错误!');
                return false;
            }
            });
        },
        // // 格式化时间
        // formatDateTime(cellValue) {
        //     return moment(cellValue).format('0001/01/01 HH:mm:ss');
        // },
        // resetForm(formName) {
        //     this.$refs[formName].resetFields();
        // },
        // handleClick(tab, event) {
        //     console.log(tab, event);
        // },
        // 添加
        mealSave() {
            const url = window.$config + `api/Roles/RoleSave`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '添加成功',
                            type: 'success',
                        });
                        this.cancelModule();
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
                return false;
        },
         // 编辑
        mealEdit() {
            const url = window.$config + `api/Roles/RoleSave`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '编辑成功',
                            type: 'success',
                        });
                        this.cancelModule();
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
                return false;
        },
        

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
</style>