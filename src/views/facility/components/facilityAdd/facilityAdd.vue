<template>
 <el-dialog
  class="commonDialog"
  :title="parentTitle === 1 ? '添加新设备' : '编辑新设备'"
  :visible.sync="visible"
  :close-on-click-modal="false"
  width="400px"
  v-loading="loading"
  element-loading-text="拼命上传中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  :before-close="cancelModule">
        <el-form ref="addMeal" :model="addMeal" :rules="rules" class="commonForm mt45"  label-width="35%">
            <el-form-item label="设备名称:" prop="facilityName" required>
                 <el-input class="commonInput" v-model="addMeal.facilityName"></el-input>
            </el-form-item>
            <el-form-item label="设备类型:" prop="equipmentId" required>
                 <el-select class="commonSelect" v-model="addMeal.equipmentId"   placeholder="请选择" value-key="id">
                    <el-option
                        v-for="item in parentOptionsList"
                        :key="item.id"
                        :label="item.equipmentName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="IP地址:" required>
                  <el-input class="commonInput" v-model="addMeal.ip" @blur="validateIp(addMeal.ip)"></el-input>
            </el-form-item>
            <el-form-item label="设备状态:" prop="facilityStatus" required> 
                 <el-select class="commonSelect" v-model="addMeal.facilityStatus" placeholder="请选择" value-key="id">
                    <el-option
                        v-for="item in facilityStatusList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备SN:" prop="facilitySN" required>
                 <el-input class="commonInput" v-model="addMeal.facilitySN" onkeyup="this.value=this.value.replace(/[\u4e00-\u9fa5]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="设备负责人:" prop="userName" required>
                 <el-input class="commonInput" v-model="addMeal.userName" ></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="mobile" required>
                 <el-input class="commonInput" v-model="addMeal.mobile" ></el-input>
            </el-form-item>
            <el-form-item label="设备地址:" prop="facilityAddress" required>
                 <el-input class="commonInput" v-model="addMeal.facilityAddress" ></el-input>
            </el-form-item>
            <el-form-item label="设备照片:" >
                 <el-upload
                    ref="upload"
                    class="avatar-uploader"
                    accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp"
                    :action="imgUrl"
                    :data="datas"
                    name="UploadFile"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <el-image  v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item class="btnsLine mt30">
                <el-button class="commonButton" @click.native="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" @click.native="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
                <el-button class="commonButton" @click.native="submitEditForm('addMeal')" v-else-if="parentTitle === 2">确定</el-button>
            </el-form-item>
        </el-form>
</el-dialog>
</template>
<script>
import axios from 'axios';
import { formatDate } from '@/filters/index';
export default {
    props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'parentOptionsList', 'getAddresses', 'nameList'],
    data() {
        //验证手机号
        var validateMobile = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
            if (!value) {
            return callback(new Error('联系电话不能为空'))
            }
            setTimeout(() => {
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
        //验证下拉选择框
        var validateSelect = (rule, value, callback) => {
            if (value === -1 || !value) {
            callback(new Error('请选择设备类型'));
            } else {
            callback();
            }
        };
         
        return {
            selectDefault: -1,
            facilityStatusList: [{
                id: 0,
                name: '未使用'
            },{
                id: 1,
                name: '使用中'
            },{
                id: 2,
                name: '离线'
            }], // 设备类型列表
            imgUrl: window.$imgUrl,
            imageUrl: '',       //上传图片url
            userId: 0,
            userName: '',
            visible: false,
            isShowSelect:false,
            addMeal: {
                facilityName: '',
                equipmentId: this.selectDefault,
                ip:'',
                facilityStatus: 0,
                facilitySN: this.selectDefault,
                userName:'',
                mobile:'',
                facilityAddress:'',
                facilityPictures: '',
                isSet: 0
            },
            restaurantObj: {}, // 食堂对象
            org:[],
            activeIndex:0,
            defaultProps:{
                pageSize: 10,
                pageIndex: 1
            },
            list:[],
            datas: {},
            rolesLists: [],
            rules: {
                facilityName: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' }
                ],
                equipmentId: [
                    { validator: validateSelect, trigger: 'change' }
                ],
                // ip: [
                //     { validator: validateIp, trigger: 'blur' }
                // ],
                facilityStatus: [
                    { required: true, message: '请选择设备状态', trigger: 'change' }
                ],
                facilitySN: [
                    { required: true, message: '请输入设备SN', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入设备负责人', trigger: 'blur' }
                ],
                mobile: [
                    {  validator: validateMobile, trigger: 'blur' }
                ],
                facilityAddress: [
                   { required: true, message: '请输入设备地址', trigger: 'blur' }
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
        async init(){
            this.$nextTick(() => {
                if(this.parentTitle == 2) {
                    this.initFormData();
                }
            });
        },
        // 验证IP地址
        validateIp(e) {
            const value = e;
            const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if(!value) {
                this.$message.closeAll();
                 this.$message({
                     message: 'IP地址不能为空',
                     type: 'warn'
                 });
                 return false;
            }else if (ipReg.test(value)) {
                return true;
            } else {
                this.$message.closeAll();
                this.$message({
                    message: 'IP地址格式不正确',
                    type: 'warn'
                });
                return false;
            }
        },
        initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          this.userId = JSON.parse(user).userId;
          this.userName = JSON.parse(user).userName;
          this.datas.userName =  'shebei';
          this.datas.FileName =  'shebei';
          this.datas.userId = this.userId;
          this.datas.type = 2;
          this.restaurantObj = this.cateenInfo;
          if(Object.keys(this.restaurantObj).length) {
              this.addMeal.restaurantId = this.restaurantObj.id;
              this.datas.restaurantId = this.restaurantObj.id;
              this.datas.restaurantName = this.restaurantObj.name;
          }
       },
        // 编辑初始化表单
        initFormData(){
            let obj = JSON.parse(JSON.stringify(this.parentCurrentMeal));
            if(Object.keys(obj).length) {
                Object.keys(obj).forEach(item => {
                    let formKey = item.replace(item[0], item[0].toLowerCase());
                    this.addMeal[formKey] = obj[item];
                })
            }
            if(this.addMeal.facilityPictures) {
                this.imageUrl = this.addMeal.facilityPictures;
                this.datas.sourcePath = this.imageUrl;
            }
        },
         //关闭弹框
        cancelModule(val) {
            this.$emit('cancelModule', val);
        },
        //图片上传
        handleAvatarSuccess(res, UploadFile) {
            this.loading = false;
            this.$refs.upload.clearFiles();
            this.imageUrl = window.$imgUrlPrev + res.result;
            if(this.addMeal.facilityPictures) {
                this.datas.sourcePath = this.addMeal.facilityPictures;
            }else {
                this.datas.sourcePath = this.imageUrl;
            }
            this.addMeal.facilityPictures = this.imageUrl;
            
        },
        // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {
            this.imageUrl = "";
            this.loading = true;
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
        submitForm(formName) {
            let that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(that.validateIp(that.addMeal.ip)) {
                        this.mealSave();
                    }
                } else {
                    console.log('提交错误!');
                    return false;
                }
            });
        },
        // 编辑
         submitEditForm(formName) {
             let that = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(that.validateIp(that.addMeal.ip)) {
                    this.mealEdit();
                }
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
        // 添加
        mealSave() {
            this.org = this.addMeal.organization
            console.log(this.addMeal);
            const url = window.$facilityUrl + `api/Facility/FacilityAdd`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                        this.$emit('getAddresses');
                         this.$message({
                            message: '添加成功',
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
         // 编辑设备信息
        mealEdit() {
            const url = window.$facilityUrl + `api/Facility/FacilityUpdate`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '编辑成功',
                            type: 'success',
                        });
                        this.cancelModule(false)
                    } else if(rsp.data.message){
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
                return false;
        }
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
                this.addMeal.restaurantId = this.restaurantObj.id;
                this.datas.restaurantId = this.restaurantObj.id;
                this.datas.restaurantName = this.restaurantObj.name;
            },
            deep: true
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