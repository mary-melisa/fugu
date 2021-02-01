<template>
 <el-dialog
  class="commonDialog"
  title="重置密码"
  :visible.sync="visible"
  :close-on-click-modal="false"
  width="400px"
  v-loading="loading"
  element-loading-text="拼命上传中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  :before-close="cancelModule">
        <el-form ref="addMeal" :model="addMeal" :rules="rules" class="commonForm mt45"  label-width="35%">
            <el-form-item label="姓名:">
                 <el-input class="commonInput" v-model="username" disabled></el-input>
            </el-form-item>
            <el-form-item label="卡号:">
                 <el-input class="commonInput" v-model="id" disabled></el-input>
            </el-form-item>
            <el-form-item label="重置密码:" prop="password" required>
                <el-input type="password" class="commonInput" v-model="addMeal.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="repassWord" required>
                 <el-input class="commonInput" v-model="addMeal.repassWord"></el-input>
            </el-form-item>
            <el-form-item class="btnsLine mt30">
                <el-button class="commonButton" @click.native="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" @click.native="submitForm('addMeal')">确定</el-button>
            </el-form-item>
        </el-form>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['passwordDialog', 'getTableData', 'currentMeal', 'setPassword'],
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入确认密码'));
            } else if (value !== this.addMeal.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            selectDefault: -1,
            userId: this.selectDefault,
            userName: '',
            visible: false,
            isShowSelect:false,
            id: '',
            addMeal: {
                password: '',
                repassWord: '',
            },
            restaurantObj: {}, // 食堂对象
            defaultProps:{
                pageSize: 10,
                pageIndex: 1
            },
            rules: {
                password: [
                    { required: true, message: '请输入重置密码', trigger: 'blur' }
                ],
                repassWord: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
     computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted(){
        this.initUserInfo();
        this.visible = true;
        this.init();
    },
    methods: {
        init(){
            this.$nextTick(() => {
                this.initFormData();
            });
        },

        initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          this.userId = JSON.parse(user).userId;
          this.userName = JSON.parse(user).userName;
       },
        // 编辑初始化表单
        initFormData(){
            let obj = JSON.parse(JSON.stringify(this.currentMeal));
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

        // 重置密码
        mealSave() {
            const url = window.$facilityUrl + `api/MaintenanceRecord/MaintenanceRecordAdd`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '重置密码成功',
                            type: 'success',
                        });
                        this.cancelModule(false)
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
    },
    watch: {
      form: {
        handler(form){
         if(this.isShowSelect){
          this.$refs.selectTree.filter(addMeal.organization);
         }
        },
        deep: true,//深度监听，重要
      },
      cateenInfo: {
            handler(newValue){
                this.restaurantObj = newValue;
                this.conditionForm.restaurantId = this.restaurantObj.id;
                this.getTableData();
            },
            deep: true
        }
     },
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
            .btnsLine .mt30{
                margin-top: 30px;
            }
        }
        .objectTree {
            margin-left:97px;
            position: absolute;
            overflow: auto;
            z-index: 100;
            height: 200px;
            border: 1px solid #ddd;
            line-height: normal; 
            z-index: 204;
            }
            .width-220{
            width: 220px
            }
    }
</style>