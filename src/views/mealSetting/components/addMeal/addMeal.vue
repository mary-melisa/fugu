<template>
 <el-dialog
  class="commonDialog"
  :title="parentTitle === 1 ? '新增餐别' : '编辑餐别'"
  :visible.sync="visible"
  width="580px"
  :before-close="cancelModule">
        <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="40%">
            <el-form-item label="所属食堂:">
                <el-input class="commonInput" v-model="company" disabled></el-input>
            </el-form-item>
            <el-form-item label="餐别名称:" prop="mealName" required>
                 <el-input class="commonInput" v-model="addMeal.mealName"></el-input>
            </el-form-item>
            <el-form-item label="开始时间:" prop="startTime" required>
                <el-date-picker class="commonDatePicker" type="date" placeholder="选择餐别开始时间" v-model="addMeal.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:" prop="endTime" required>
                <el-date-picker class="commonDatePicker" type="date" placeholder="选择餐别结束时间" v-model="addMeal.endTime"></el-date-picker>
            </el-form-item>
            <el-form-item class="btnsLine mt60">
                <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" type="primary" @click.prevent="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
                <el-button class="commonButton" type="primary" @click.prevent="submitEditForm('addMeal')" v-if="parentTitle === 2">确定</el-button>
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
            urlPrev: 'http://webapi.free.idcfengye.com/',
            visible: false,
            company: '孚谷第一食堂',
            addMeal: {
                restaurantId: '1',
                mealName: '',
                startTime: '',
                endTime: '',
                userName: '张三',
                mobile: '13232326253'
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
            this.addMeal = this.parentCurrentMeal;
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
        // 添加餐别
        mealSave() {
            const url = this.urlPrev + `api/bdmealinfo/addmeal`;
            this.addMeal.startTime = this.formatDateTime(this.addMeal.startTime);
            this.addMeal.endTime = this.formatDateTime(this.addMeal.endTime);
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$alert('餐别保存成功', '提示', {
                            confirmButton: '确定',
                            type: 'success',
                        });
                    } else {
                        this.$alert('餐别保存失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
                return false;
        },
         // 编辑餐别
        mealEdit() {
            const url = this.urlPrev + `api/bdmealinfo/editmeal`;
            this.addMeal.startTime = this.formatDateTime(this.addMeal.startTime);
            this.addMeal.endTime = this.formatDateTime(this.addMeal.endTime);
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$alert('编辑餐别成功', '提示', {
                            confirmButton: '确定',
                            type: 'success',
                        });
                    } else {
                        this.$alert('编辑餐别失败', '提示', {
                            confirmButton: '确定',
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