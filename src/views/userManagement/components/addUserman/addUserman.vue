<template>
 <el-dialog
  class="commonDialog"
  :title="parentTitle === 1 ? '添加用户' : '编辑用户'"
  :visible.sync="visible"
  :close-on-click-modal="false"
  v-loading="loading"
  element-loading-text="拼命上传中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"
  width="400px"
  :before-close="cancelModule">
        <el-form ref="addMeal" :model="addMeal" :rules="rules" class="commonForm mt45"  label-width="35%" autocomplete="off" @submit.native.prevent="submitForm('addMeal')">
            <el-form-item label="姓名:" prop="name" required>
                 <el-input class="commonInput" v-model="addMeal.name" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="用户名:" prop="userName" required>
                 <el-input class="commonInput" v-model="addMeal.userName" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="登录密码:" prop="password" v-if="parentTitle === 1" required>
                 <el-input type="password" class="commonInput" v-model="addMeal.password" maxlength="50"></el-input>
            </el-form-item>

            <!-- 添加组织 -->
            <el-form-item label="组织架构:" prop="organization" required>
                   <el-input
                        placeholder="请选择组织架构"
                        class="commonInput"
                        auto-complete="off"
                        v-model="organizationName"
                        @click.native="changeSelectTree()"
                        @blur="hideParentClick"
                    >
                    </el-input>
            <!-- 编辑组织 -->
                    <!-- <el-input
                        v-else
                        placeholder="请选择组织架构"
                        class="commonInput"
                        auto-complete="off"
                        v-model="organizationName"
                        @click.native="changeSelectTree()"
                        @blur="hideParentClick"
                    >
                    </el-input> -->
                    <el-tree id="floatTree"
                        v-show="isShowSelect"
                        show-checkbox
                        node-key="id"
                        empty-text="暂无数据"
                        :props="treeProps"
                        :highlight-current = true
                        :default-expand-all = false
                        :expand-on-click-node="true"
                        :data="list"
                        :filter-node-method="filterNode"
                        @check="selectClassfy"
                        class="width-220 selectTree-input objectTree"
                        ref="selectTree">
                    </el-tree>
            </el-form-item>
            <el-form-item label="角色:" required>
                 <el-select class="commonSelect" v-model="userRole" @change="changeSelectRole"  placeholder="请选择" value-key="id">
                    <el-option
                        v-for="item in rolesLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系电话:" prop="mobile" required> 
                 <el-input class="commonInput" v-model.number="addMeal.mobile"   maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" prop="cardNumber" required>
                 <el-input class="commonInput" v-model="addMeal.cardNumber"  maxlength="18" minlength="18"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="gender" required>
                 <template>
                    <el-radio v-model="addMeal.gender" :label="1">男</el-radio>
                    <el-radio class="ml15" v-model="addMeal.gender" :label="0">女</el-radio>
                </template>
            </el-form-item>
            <el-form-item label="用户头像:" prop="email" >
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
                <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
                <el-button class="commonButton" @click.native="submitForm('addMeal')">确定</el-button>
            </el-form-item>
        </el-form>
</el-dialog>
</template>
<script>
import axios from 'axios';
import { formatDate } from '@/filters/index';
export default {
    props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'parentOptionsList'],
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
        //验证身份证号
        var validateCardNum = (rule, value, callback) => {
            const phoneReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!value) {
            return callback(new Error('身份证号不能为空'))
            }
            setTimeout(() => {
            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (phoneReg.test(value)) {
                callback()
                } else {
                callback(new Error('身份证号式不正确'))
                }
            }
            }, 100)
        }
        return {
            loading: false,
            selectDefault: -1,
            imgUrl: window.$imgUrl,
            imageUrl: '',       //上传图片url
            userRole: {},
            userId: 0,
            userName: '',
            visible: false,
            treeProps:{
                children: 'children',
                label: 'name'
            },
            isShowSelect:false,
            organizationName:'',
            treeId: -1,
            Role:{},
            addMeal: {
                name: '',
                userName:'',
                password: '',
                organization:'',
                role:'',
                mobile:'',
                cardNumber:'',
                gender:'',
                email:''
            },
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
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' }
                ],
                organization: [
                    { required: true, message: '请选择组织', trigger: 'blur' }
                ],
                mobile: [
                    {  validator: validateMobile, trigger: 'blur' }
                ],
                cardNumber: [
                    { validator: validateCardNum,  trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
            },
            restaurantObj: {}, // 所属食堂
            uploadFlag: 0, //新增时是否是第一次上传照片 0 第一次上传 1重复上传
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
        preventDefault(){
            return false;
        },
        async init(){
            this.getroles();
            await this.getlist();
            this.$nextTick(() => {
                if(this.parentTitle == 2) {
                    this.initFormData();
                }
            });
        },
        getroles(){
            this.rolesLists = [];
            const that = this;
            this.parentOptionsList.forEach(item => that.rolesLists.push({ id: item.id, name: item.name }));
            console.log(this.rolesLists);
        },
        initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          if(user) {
            this.userId = JSON.parse(user).userId;
            this.userName = JSON.parse(user).userName;
            this.datas.userName =  this.userName;
            this.datas.userId = this.userId;
          }
          this.datas.FileName = 'yonghu';
          this.datas.type = 2;
          this.restaurantObj = this.cateenInfo;
          if(this.restaurantObj.id) {
              this.addMeal.restaurantId = this.restaurantObj.id; 
              this.datas.RestaurantId = this.restaurantObj.id;
              this.datas.RestaurantName = this.restaurantObj.name;
          }
       },
        //下拉选择
        selectClassfy(data) {
            console.log(this.$refs.selectTree.getCheckedNodes());
            this.addMeal.organization = [];
            this.addMeal.organization.push({
                id: this.list[0].id,
                name: this.list[0].name
            })
            this.organizationName = "";
            let preName = this.list[0].name + ",";
            this.organizationName += preName;
            let arr = this.$refs.selectTree.getCheckedNodes();
            let treeKeys = [];
            arr.forEach(item => {
                this.addMeal.organization.push({
                    id: item.id,
                    name: item.name
                })
                this.organizationName += item.name + ","
                treeKeys.push(item.id);
            })
            console.log(this.addMeal.organization,"2342342",this.organizationName);
            this.$refs.selectTree.setCheckedKeys(treeKeys);
            this.isShowSelect=false;
        },
        changeSelectRole(data) {
            this.addMeal.role=[];
            this.addMeal.role.push(data);
            this.userRole = data;
        },

        changeSelectTree(){
            this.isShowSelect=true;
        },
        hideParentClick(e) {
            var isOther = e.relatedTarget == null || e.relatedTarget.closest("div.el-tree") 
            == null || e.relatedTarget.closest("div.el-tree").id != "floatTree";
    
            if (isOther) {
                this.isShowSelect = false;
            } else {
                e.target.focus();
            }
        },
        // 选择器的树节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        // 编辑初始化表单
        initFormData(){
            
            this.addMeal = JSON.parse(JSON.stringify(this.parentCurrentMeal));
            delete this.addMeal.password;
            console.log(this.addMeal);
            
            if(this.addMeal.headPortrait) {
                this.imageUrl = this.addMeal.headPortrait;
                this.datas.sourcePath = this.imageUrl;
            }
            this.parentCurrentMeal.organization.sort(function(a,b){
                return a.id-b.id;
            });
            this.parentCurrentMeal.organization.forEach(item => {
                this.organizationName += item.name+',';
            });
            if(this.parentCurrentMeal.role.length) {
                this.userRole = this.parentCurrentMeal.role[0];
            }
            if(this.parentCurrentMeal.organization.length) {
                let treeKeys = [];
                this.organizationName = "";
                this.parentCurrentMeal.organization.forEach(item => {
                    this.organizationName += item.name + ","
                    if(item.id != 1) {
                        treeKeys.push(item.id);
                    }
                })
                this.$refs.selectTree.setCheckedKeys(treeKeys);
            }
        },
         //关闭弹框
        cancelModule(val) {
            this.$emit('cancelModule', val);
        },
        //图片上传
        handleAvatarSuccess(res, UploadFile) {
            this.loading = false;
            // 清空上传后文件列表
            this.$refs.upload.clearFiles();
            this.imageUrl = window.$imgUrlPrev + res.result;
            this.addMeal.headPortrait = this.imageUrl;
            this.uploadFlag = 1;
        },
        // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {
            this.loading = true;
            if(this.uploadFlag === 1) {
                this.datas.sourcePath = this.imageUrl;
            }
            console.log(this.uploadFlag);
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
        //获取组织架构
        async getlist(){
            let config = {
                method: 'post',
                url: window.$config+'api/Organization/GetOrganizationTree',
                data : this.defaultProps
            };
            await axios(config)
            .then(rsp=>{
                if(rsp.data.status==1){
                    this.list=rsp.data.result;
                } else {
                    console.log("获取失败")
                }
            })
            .catch(err=> console.log(err));
        },
        // 新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.addMeal.role && this.addMeal.role.length){
                        this.mealSave();
                    }else {
                        this.$message({
                            message: '请选择角色',
                            type: 'warn'
                        })
                    }
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
            const url = window.$config + `api/User/UserSave`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
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
         // 编辑类别
        mealEdit() {
            this.addMeal.organization=this.org;
            const url = window.$config + `api/User/UserSave`;
            axios({ method: 'post', url: url, data: this.addMeal })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$emit('getParentTableData');
                         this.$message({
                            message: '编辑成功',
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
            this.datas.RestaurantId = this.restaurantObj.id;
            this.datas.RestaurantName = this.restaurantObj.name;
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