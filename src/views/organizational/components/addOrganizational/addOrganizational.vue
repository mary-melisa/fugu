<template>
 <el-dialog
  class="commonDialog"
  title="添加"
  :visible.sync="visible"
  width="400px"
  :before-close="cancelModule">
   <el-tabs class="dialogTabs" v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="添加组织" name="first">
        <el-form ref="addOrgnForm" class="commonForm" :rules="rules" :model="addOrgnForm" label-width="96px">
            <el-form-item label="所属上级:">
                <el-input class="commonInput" v-model="company" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称:" prop="organizationName" required>
                 <el-input class="commonInput" v-model="addOrgnForm.organizationName"></el-input>
            </el-form-item>
            <el-form-item label="联系人:" prop="userName" required>
                <el-input class="commonInput" v-model="addOrgnForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="mobile" required>
                <el-input class="commonInput" v-model="addOrgnForm.mobile" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="地址:" prop="address" required>
                <el-input class="commonInput" v-model="addOrgnForm.address"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
                <el-input class="commonTextarea" type="textarea" v-model="addOrgnForm.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" type="primary" @click="submitForm('addOrgnForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
    <el-tab-pane label="添加食堂" name="second">
         <el-form ref="addCanteenForm" class="commonForm" :model="addCanteenForm" :rules="canteenRules" label-width="120px">
            <el-form-item label="食堂名称:" prop="restaurantName">
                <el-input class="commonInput" v-model="addCanteenForm.restaurantName"></el-input>
            </el-form-item>
            <el-form-item label="业务模式:" prop="patternType">
                 <el-select class="commonSelect" v-model="addCanteenForm.patternType">
                    <el-option label="AI智能模式" value="1">AI智能模式</el-option>
                    <el-option label="RFID智盘" value="2">RFID智盘</el-option>
                    <el-option label="人脸识别自助" value="3">人脸识别自助</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="食堂地址:" prop="address">
                <el-input class="commonInput" v-model="addCanteenForm.address"></el-input>
            </el-form-item>
            <el-form-item label="就餐人数:" prop="number">
                <el-input type="number" class="commonInput" v-model="addCanteenForm.number"></el-input>
            </el-form-item>
            <el-form-item label="食堂负责人:" prop="userName">
                <el-input class="commonInput" v-model="addCanteenForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="mobile" required>
                <el-input class="commonInput" v-model="addCanteenForm.mobile" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="食堂照片:">
                <el-upload
                    class="avatar-uploader"
                    action="https://172.16.10.83:8011/api/Facility/FacilityUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
                <el-button type="primary" class="commonButton" @click="submitCanteenForm('addCanteenForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
  </el-tabs>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['parentDialogVisible'],
    data() {
      var validateMobile = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/
            if (!value) {
            return callback(new Error('联系电话不能为空'))
            }
            setTimeout(() => {
            // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
            // 所以我就在前面加了一个+实现隐式转换

            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (phoneReg.test(value)) {
                callback()
                } else {
                callback(new Error('联系电话格式不正确'))
                }
            }
            }, 100)
        }
        return {
            urlPrev: 'http://sysapi.free.idcfengye.com/',
            visible: false,
            activeName: 'first',
            company: '孚谷餐饮有限公司',
            addOrgnForm: {
                organizationName: '',
                userName: '',
                mobile: '',
                address: '',
                remark: ''
            },
             rules: {
                organizationName: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                mobile: [
                    { validator: validateMobile, trigger: 'blur' }
                ],
                address: [
                     { required: true, message: '请输入地址', trigger: 'blur' }
                ]
            },
            addCanteenForm: {
                restaurantName: '',
                patternType: '1',
                address: '',
                mobile: '',
                userName: '',
                pictures: ''
            },
             canteenRules: {
                restaurantName: [
                    { required: true, message: '请输入食堂名称', trigger: 'blur' }
                ],
                patternType: [
                    { required: true, message: '请选择业务模式', trigger: 'change' }
                ],
                number: [
                    { required: true, message: '请输入就餐人数', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入食堂地址', trigger: 'blur' }
                ],
                userName: [
                     { required: true, message: '请输入食堂负责人', trigger: 'blur' }
                ],
                mobile: [
                    { validator: validateMobile, trigger: 'blur' }
                ]
            },
            imageUrl: '',

        }
    },
    mounted(){
         this.visible = true;
    },
    methods: {
         //关闭弹框
        cancelModule(val) {
            this.$emit('cancelModule', val);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.organizationSave();
            } else {
                console.log('提交错误!');
                return false;
            }
            });
        },
        submitCanteenForm(formName){
             this.$refs[formName].validate((valid) => {
            if (valid) {
                this.canteenSave();
            } else {
                console.log('提交错误!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        // 组织架构保存
        organizationSave() {
            console.log('表单数据',this.addOrgnForm)
            const url = this.urlPrev + `api/Organization/OrganizationSave`;
            axios({ method: 'post', url: url, data: this.addOrgnForm })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                         this.$alert('组织架构保存成功', '提示', {
                            confirmButton: '确定',
                            type: 'success',
                        });
                    } else {
                        this.$alert('组织架构保存失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
        },
         // 添加食堂
         canteenSave() {
            console.log('表单数据',this.addCanteenForm)
            const url = this.urlPrev + `/api/Restaurant/GetRestaurantServiceModel`;
            axios({ method: 'post', url: url, data: this.addCanteenForm })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                       
                    } else {
                        console.log('食堂保存失败！');
                        this.$alert('食堂保存失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
        },
         handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;

            if (!(isJPG || isPNG)) {
                this.$message.error('食堂照片只能是 JPG、png 格式!');
            }
            if (!isLt5M) {
                this.$message.error('食堂照片大小不能超过 5MB!');
            }
            return (isJPG || isPNG) && isLt5M;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>