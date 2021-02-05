<template>
  <el-dialog class="commonDialog" :title="parentTitle === 1 ? '添加会员信息' : '编辑会员信息'" :visible.sync="visible" width="400px"
    v-loading="loading" element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" :close-on-click-modal="false" :before-close="cancelModule">
    <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="35%"
      @submit.native.prevent>
      <el-form-item label="姓名:" prop="userName" required>
        <el-input class="commonInput" v-model="addMeal.userName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="会员类型:" prop="categoryId" required>
        <el-select class="commonSelect" v-model="addMeal.categoryId" @change="selectValue" placeholder="请选择">
          <!-- <el-option :value="defaultSelect" label="请选择">请选择</el-option> -->
          <el-option v-for="item in userTypesList" :key="item.id" :label="item.categoryName" :value="item.id">
            {{item.categoryName}}
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 选择学生还是会员 usertype=1代表学生 -->
      <el-form-item v-if="usertype == 1" label="班级:" :required="usertype == 1 ? true : false">
        <el-input class="commonInput" v-model.trim="className" maxlength="40"></el-input>
      </el-form-item>

      <!-- <el-form-item v-if="this.usertype==1"  label="身份证号:" :rules="{required: true, message: '请输入身份证号', trigger: 'blur'}">
                <el-input class="commonInput" placeholder="请输入身份证号" v-model="idNumber" ></el-input>
            </el-form-item> -->
      <el-form-item label="身份证号:" :required="usertype == 1 ? true : false">
        <el-input class="commonInput" placeholder="请输入身份证号" v-model="idNumber" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="工号:" :required="usertype == 1 ? true : false" v-if="parentTitle === 1">
        <el-input class="commonInput" :placeholder="usertype === 1 ? '可输入学生编号、学籍号' : ''"
          v-model="employeeID" maxlength="20" onkeyup="value=value.replace(/[^\d]/g,'')" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"></el-input>
      </el-form-item>
      <!-- <el-form-item v-if="this.usertype==1" label="联系电话:" prop="mobile" >
                <el-input class="commonInput" v-model="addMeal.mobile" ></el-input>
            </el-form-item> -->
      <el-form-item label="联系电话:" :required="usertype == 1 ? false : true">
        <el-input class="commonInput" v-model="mobile" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item v-if="parentTitle === 1" label="卡号:">
        <el-input class="commonInput" v-model="cardNumber" maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <template>
          <el-radio v-model="gender" :label="1">男</el-radio>
          <el-radio class="ml15" v-model="gender" :label="0">女</el-radio>
        </template>
      </el-form-item>
      <!-- <el-form-item label="人脸照片:">
        <el-upload ref="upload" class="avatar-uploader" accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp" :action="imgUrl"
          :data="datas" name="UploadFile" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item> -->
      <el-form-item class="btnsLine mt60">
        <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
        <el-button class="commonButton" @click.prevent="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
        <el-button class="commonButton" @click.prevent="submitEditForm('addMeal')" v-if="parentTitle === 2">确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
export default {
  props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal'],
  data () {
    //验证下拉选择框
    var validateSelect = (rule, value, callback) => {
      if (Number(value) === this.defaultSelect) {
        callback(new Error('请选择会员类型'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      imgUrl: window.$imgUrl,
      urlPrev: 'http://39.106.7.166:8089/',
      visible: false,
      usertype: 1,//1学生  0会员
      addMeal: {
        userName: '',
        categoryId: '',
        userType: 1
      },
      cardNumber: '',
      mobile: '',
      className: '',
      idNumber: '',
      gender: '',
      employeeID: '',
      defaultSelect: -1,
    //   datas: {},
    //   imageUrl: '',
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择会员类型', trigger: 'change' }
        ]
      },
      userId: 0,
      userName: "",
      defaultProps: {
        pageSize: 1000,
        pageIndex: 1,
      },
      userTypesList: [], // 用户类别列表
      restaurantObj: {}, // 食堂对象
      uploadFlag: 0, //新增时是否是第一次上传照片 0 第一次上传 1重复上传
    }
  },
  computed: {
    cateenInfo () {
      return this.$store.state.Account.cateenInfo
    }
  },
  mounted () {
    this.visible = true;
    // 初始化用户信息
    this.initUserInfo();
  },
  methods: {
    //验证手机号
    validateMobile (value) {
      const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      this.$message.closeAll();
      if (!Number.isInteger(+value)) {
        this.$message({
          message: '联系电话请输入数字值',
          type: 'warn'
        })
        return false;
      } else {
        if (phoneReg.test(value)) {
          return true;
        } else {
          this.$message({
            message: '联系电话格式不正确',
            type: 'warn'
          })
          return false;
        }
      }
    },
    //验证身份证号
    validateCardNum (value) {
      const phoneReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      this.$message.closeAll();
      if (!Number.isInteger(+value)) {
        this.$message({
          message: '身份证号请输入数字值',
          type: 'warn'
        })
        return false;
      } else {
        if (phoneReg.test(value)) {
          return true;
        } else {
          this.$message({
            message: '身份证号式不正确',
            type: 'warn'
          })
          return false;
        }
      }
    },
    // 获取会员类型
    async getUserTypes () {
      const url = window.$config1 + `api/bdusertype/getusertype`;
      await axios({ method: 'post', url: url, data: this.defaultProps })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.userTypesList = rsp.data.result;
          } else {
            console.log("获取失败")
          }
        })
        .catch(err => console.log(err));
    },
    selectValue (val) {
      if (val === -1) {
        return false;
      }
      let obj = this.userTypesList.find(res => res.id === val);
      if (Object.keys(obj).length) {
        if (obj.categoryName === "学生") {
          this.usertype = 1;
          this.addMeal.userType = 1;
        }
        else {
          this.usertype = 0;
          this.addMeal.userType = 0;
        }
      }
      console.log(this.usertype);
      console.log(this.addMeal.userType);
    },
    async initUserInfo () {
      // 获取会员类型
      await this.getUserTypes();
      const user = localStorage.getItem("userInfo");
      if(user) {
        this.userId = JSON.parse(user).userId;
        this.userName = JSON.parse(user).userName;
      }

      this.restaurantObj = this.cateenInfo;
      if (this.restaurantObj.id) {
        this.addMeal.restaurantId = this.restaurantObj.id;
      }
      if (this.parentTitle === 2) {
        this.initFormData();
      }
    },
    //图片上传
    // handleAvatarSuccess (res, UploadFile) {
    //   this.loading = false;
    //   this.$refs.upload.clearFiles();
    //   this.imageUrl = window.$imgUrlPrev + res.result;
    //   this.datas.sourcePath = this.imageUrl;
    //   this.addMeal.facePhotos = this.imageUrl;
    //   this.uploadFlag = 1;
    // },
    // 封装一个判断图片文件后缀名的方法
    isImage (fileName) {
      if (typeof fileName !== 'string') return;
      let name = fileName.toLowerCase();
      return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
    },
    // beforeAvatarUpload (file) {
    //   this.loading = true;
    //   if (this.uploadFlag === 1) {
    //     this.datas.sourcePath = this.imageUrl;
    //   }
    //   console.log(this.uploadFlag);
    //   const isLt10M = file.size / 1024 / 1024 < 10;

    //   let type = this.isImage(file.name);
    //   this.$message.closeAll();
    //   if (!type) {
    //     this.$message.error('只允许上传.jpg,.gif,.jpe,.jpeg,.png,.bmp图片');
    //     return false;
    //   }
    //   if (!isLt10M) {
    //     this.$message.error('上传头像图片大小不能超过 10MB!');
    //     return false;
    //   }
    //   return true;
    // },
    // 编辑初始化表单
    initFormData () {
      let obj = JSON.parse(JSON.stringify(this.parentCurrentMeal));
      console.log('编辑数据', obj);
      if (Reflect.has(obj, 'id')) {
        this.addMeal.id = obj.id;
        this.idNumber = this.addMeal.idNumber;
      }
      if (Reflect.has(obj, 'idNumber')) {
        this.addMeal.idNumber = obj.idNumber;
        this.idNumber = this.addMeal.idNumber;
      }
      if (Reflect.has(obj, 'cardNumber')) {
        this.addMeal.cardNumber = obj.cardNumber;
        this.cardNumber = this.addMeal.cardNumber;
      }
      if (Reflect.has(obj, 'memberType')) {
        this.usertype = obj.memberType;
        let categoryObj = this.userTypesList.find(item => item.categoryName === obj.category);
        if (categoryObj && Object.keys(categoryObj).length) {
          this.addMeal.categoryId = categoryObj.id;
        }
      }
      if (Reflect.has(obj, 'facePhotos')) {
        this.addMeal.facePhotos = obj.facePhotos;
        // this.imageUrl = this.addMeal.facePhotos;
        // this.datas.sourcePath = this.imageUrl;
      }
      if (Reflect.has(obj, 'userName')) {
        this.addMeal.userName = obj.userName;
      }
      if (Reflect.has(obj, 'mobile')) {
        this.addMeal.mobile = obj.mobile;
        this.mobile = obj.mobile;
      }
      if (Reflect.has(obj, 'gender')) {
        if (obj.gender === "女") {
          this.addMeal.gender = 0;
          this.gender = 0;
        } else if (obj.gender === "男") {
          this.addMeal.gender = 1;
          this.gender = 1;
        }
      }
      if (Reflect.has(obj, 'className')) {
        this.addMeal.className = obj.className;
        this.className = obj.className;
      }
    },
    //关闭弹框
    cancelModule (val) {
      this.$emit('cancelModule', val);
    },
    // 新增
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.usertype, 'userType');
          // 如果是学生，验证班级、身份证必填 1学生 0 非学生
          if (this.usertype === 1) {
            if (this.className) {
              this.addMeal.className = this.className;
            } else {
              this.$message.closeAll();
              this.$message({
                message: '请输入班级',
                type: 'warn'
              })
              return false;
            }
            if (this.employeeID) {
              this.addMeal.employeeID = this.employeeID;
            } else {
              this.$message.closeAll();
              this.$message({
                message: '请输入工号',
                type: 'warn'
              })
              return false;
            }
            console.log(this.idNumber);
            if (this.idNumber) {
              this.addMeal.idNumber = this.idNumber;
              if (!this.validateCardNum(this.idNumber)) {
                return false;
              } else {
                // 性别
                if (this.gender) {
                  this.addMeal.gender = this.gender;
                }
                // 卡号
                if (this.cardNumber) {
                  this.addMeal.cardNumber = this.cardNumber;
                }
                // 联系电话
                if (this.mobile) {
                  // 如果有输入则必须验证手机号
                  if (this.validateMobile(this.mobile)) {
                    this.addMeal.mobile = this.mobile;
                  } else {
                    return false;
                  }
                }
                this.mealSave();
              }
            } else {
              this.$message.closeAll();
              this.$message({
                message: '请输入身份证号',
                type: 'warn'
              })
              return false;
            }
          } else if (this.usertype === 0) {
            this.addMeal.className = '无';
            // 会员类型为会员
            this.$message.closeAll();
            if (!this.mobile) {
              this.$message({
                message: '请填写联系电话',
                type: 'warn'
              });
              return false;
            } else {
              if (this.validateMobile(this.mobile)) {
                this.addMeal.mobile = this.mobile;
                // 如果有输入身份证号需验证
                if (this.idNumber) {
                  if (!this.validateCardNum(this.idNumber)) {
                    return false;
                  } else {
                    this.addMeal.idNumber = this.idNumber;
                  }
                }
                // 性别
                if (this.gender) {
                  this.addMeal.gender = this.gender;
                }
                // 工号
                if (this.employeeID) {
                  this.addMeal.employeeID = this.employeeID;
                } 
                // 卡号
                 if (this.cardNumber) {
                  this.addMeal.cardNumber = this.cardNumber;
                }
                this.mealSave();
              }
            }
          }
        } else {
          console.log('提交错误!');
          return false;
        }
      });
    },
    // 编辑
    submitEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果是学生，验证班级、身份证必填
          if (this.usertype === 1) {
            if (this.className) {
              this.addMeal.className = this.className;
            } else {
              this.$message.closeAll();
              this.$message({
                message: '请输入班级',
                type: 'warn'
              })
              return false;
            }
            console.log(this.idNumber);
            if (this.idNumber) {
              this.addMeal.idNumber = this.idNumber;
              if (!this.validateCardNum(this.idNumber)) {
                return false;
              } else {
                // 性别
                if (this.gender) {
                  this.addMeal.gender = this.gender;
                }
                // 卡号
                if (this.cardNumber) {
                  this.addMeal.cardNumber = this.cardNumber;
                }
                // 联系电话
                if (this.mobile) {
                  // 如果有输入则必须验证手机号
                  if (this.validateMobile(this.mobile)) {
                    this.addMeal.mobile = this.mobile;
                  } else {
                    return false;
                  }
                }
                this.mealEdit();
              }
            } else {
              this.$message.closeAll();
              this.$message({
                message: '请输入身份证号',
                type: 'warn'
              })
              return false;
            }
          } else if (this.usertype === 0) {
            // 会员类型为会员
            this.$message.closeAll();
            if (!this.mobile) {
              this.$message({
                message: '请填写联系电话',
                type: 'warn'
              });
              return false;
            } else {
              if (this.validateMobile(this.mobile)) {
                this.addMeal.mobile = this.mobile;
                // 如果有输入身份证号需验证
                if (this.idNumber) {
                  if (!this.validateCardNum(this.idNumber)) {
                    return false;
                  } else {
                    this.addMeal.idNumber = this.idNumber;
                  }
                }
                // 性别
                if (this.gender) {
                  this.addMeal.gender = this.gender;
                }
                this.mealEdit();
              }
            }
          }
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
    mealSave () {
      const url = this.urlPrev + `api/member/addmember`;
      console.log(this.addMeal);
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
    // 编辑餐别
    mealEdit () {
      const url = this.urlPrev + `api/member/editmember`;
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


  },
  watch: {
    cateenInfo: {
      handler (newValue) {
        this.restaurantObj = newValue;
        this.addMeal.restaurantId = this.restaurantObj.id;
        // this.datas.restaurantId = this.restaurantObj.id;
        // this.datas.restaurantName = this.restaurantObj.name;
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.commonDialog {
    .el-dialog {
        min-height: 200px;
        .el-dialog__body {
            min-height: 100px;
            padding: 10px 8px;
            .mt45 {
                margin-top: 27px;
            }
        }
    }
}
</style>