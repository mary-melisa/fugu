<template>
 <el-dialog
  class="commonDialog"
  title="修改营养成分"
  :visible.sync="visible"
  :close-on-click-modal="false"
  width="450px"
  :before-close="closeModule">
    <el-form ref="editNutrientForm" class="commonForm" :rules="rules" :model="editNutrientForm" label-width="35%" @submit.native.prevent>
        <el-form-item label="物料名称:">
            <el-input class="commonInput" v-model="editNutrientForm.materialName" disabled></el-input>
        </el-form-item>
        <el-form-item label="热量:" prop="heat" required>
                <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="commonInput" v-model="editNutrientForm.heat"></el-input><span class="ml10">/kcal</span>
        </el-form-item>
        <el-form-item label="脂肪:" prop="fat" required>
            <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="commonInput" v-model="editNutrientForm.fat"></el-input><span class="ml10">/g</span>
        </el-form-item>
        <el-form-item label="蛋白质:" prop="protein" required>
            <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="commonInput" v-model="editNutrientForm.protein"></el-input><span class="ml10">/g</span>
        </el-form-item>
        <el-form-item label="碳水化合物:" prop="carbohydrates" required>
            <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="commonInput" v-model="editNutrientForm.carbohydrates"></el-input><span class="ml10">/g</span>
        </el-form-item>
        <el-form-item label="膳食纤维:" prop="dietaryFiber" required>
             <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="commonInput" v-model="editNutrientForm.dietaryFiber"></el-input><span class="ml10">/g</span>
        </el-form-item>
        <el-form-item>
            <el-button class="commonButton" @click="closeModule">取消</el-button>
            <el-button class="commonButton" @click.native="submitForm('editNutrientForm')">确定</el-button>
        </el-form-item>
    </el-form>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['getParentTableData', 'cancelModule', 'parentCurrentNutrient'],
    data() {
        return {
            urlPrev: 'http://39.106.7.166:8097/',
            visible: false,
            editNutrientForm: {
                materiaName: '',
                heat: '',
                fat: '',
                protein: '',
                carbohydrates: '',
                dietaryFiber: ''
            },
             rules: {
                heat: [
                    { required: true, message: '请输入热量', trigger: 'blur' }
                ],
                fat: [
                    { required: true, message: '请输入脂肪', trigger: 'blur' }
                ],
                protein: [
                     { required: true, message: '请输入蛋白质', trigger: 'blur' }
                ],
                carbohydrates: [
                    { required: true, message: '请输入碳水化合物', trigger: 'blur' }
                ],
                dietaryFiber: [
                     { required: true, message: '请输入膳食纤维', trigger: 'blur' }
                ]
            }

        }
    },
    mounted(){
         this.visible = true;
         this.initData();
    },
    methods: {
        // 初始化数据
        initData() {
            this.editNutrientForm = JSON.parse(JSON.stringify(this.parentCurrentNutrient));
        },
        onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
         //关闭弹框
        closeModule() {
            this.$emit('cancelModule');
        },
        // 编辑
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.nutrientSave();
            } else {
                console.log('提交错误!');
                return false;
            }
            });
        },
        nutrientSave(){
            const url = this.urlPrev + `api/bddishes/editdishes`;
            axios({ method: 'post', url: url, data: this.editNutrientForm })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                         this.$message({
                            message: '营养成分修改成功',
                            type: 'success',
                        });
                        this.$emit('getParentTableData');
                        this.closeModule();
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
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
            }
        }
    }
</style>