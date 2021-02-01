<template>
 <el-dialog
  class="commonDialog"
  :title="批量充值"
  :visible.sync="visible"
  :append-to-body="true"
  width="450px"
  :before-close="cancelModule">
        <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="40%">
            <div>您已选中10个账号</div>
            <el-form-item label="充值金额:" prop="mealName" placeholder="请输入充值金额" required>
                 <el-input class="commonInput" v-model="addMeal.mealName"></el-input>
            </el-form-item>
            <el-form-item class="btnsLine mt60">
                <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" @click.prevent="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
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
            urlPrev: 'http://39.106.7.166:8097/',
            visible: false,
            addMeal: {
                mealName: '',
                startTime: '',
                endTime: '',
            },
            rules: {
                mealName: [
                    { required: true, message: '请输入餐别名称', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '选择餐别开始时间', trigger: 'blur' }
                ],
                endTime: [
                    { required: true, message: '选择餐别结束时间', trigger: 'blur' }
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
        // 新增餐别
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
        // 编辑餐别
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
        // 格式化时间
        formatDateTime(cellValue) {
            return moment(cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        // 添加
        mealSave() {
            const url = this.urlPrev + `api/bdmealinfo/addmeal`;
            this.addMeal.startTime = this.formatDateTime(this.addMeal.startTime);
            this.addMeal.endTime = this.formatDateTime(this.addMeal.endTime);
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '添加成功',
                            type: 'success',
                        });
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
            const url = this.urlPrev + `api/bdmealinfo/editmeal`;
            this.addMeal.startTime = this.formatDateTime(this.addMeal.startTime);
            this.addMeal.endTime = this.formatDateTime(this.addMeal.endTime);
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '编辑成功',
                            type: 'success',
                        });
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
                return false;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>