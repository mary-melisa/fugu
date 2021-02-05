<template>
  <el-dialog class="commonDialog" :title="parentTitle === 1 ? '添加新设备' : '编辑新设备'" :visible.sync="visible"
    :close-on-click-modal="false" width="400px" v-loading="loading" element-loading-text="拼命上传中"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
    :before-close="cancelModule">
    <el-form ref="addMeal" :model="addMeal" :rules="rules" class="commonForm mt45" label-width="35%">
      <el-form-item label="设备名称:" prop="facilityName" required>
        <el-input class="commonInput" v-model="addMeal.facilityName" maxlength="100" @input="changeUserName"></el-input>
      </el-form-item>
      <el-form-item label="设备类型:" prop="equipmentId" required>
        <el-select class="commonSelect" v-model="addMeal.equipmentId" placeholder="请选择" value-key="id">
          <el-option v-for="item in parentOptionsList" :key="item.id" :label="item.equimentTypeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP地址:" required>
        <el-input class="commonInput" v-model="addMeal.ip" @blur="validateIp(addMeal.ip)" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="设备状态:" prop="facilityStatus" required>
        <el-select class="commonSelect" v-model="addMeal.facilityStatus" placeholder="请选择" value-key="id">
          <el-option v-for="item in facilityStatusList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备SN:" prop="facilitySN" required>
        <el-input class="commonInput" v-model="addMeal.facilitySN"
          onkeyup="this.value=this.value.replace(/[\u4e00-\u9fa5]/g,'')" maxlength="40"></el-input>
      </el-form-item>
      <el-form-item label="设备负责人:" prop="userName" required>
        <el-input class="commonInput" v-model="addMeal.userName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="mobile" required>
        <el-input class="commonInput" v-model="addMeal.mobile" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="设备地址:" prop="facilityAddress" required>
        <el-input class="commonInput" v-model="addMeal.facilityAddress" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="设备照片:">
        <el-upload ref="upload" accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp" :action="uploadUrl" :data="datas" name="UploadFile" class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="delBar" v-if="imageUrl"><i class="el-icon-delete delIcon"></i></div>
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
// import UploadImg from "@/components/uploadImg/uploadImg.vue";
export default {
  props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'parentOptionsList', 'getAddresses', 'nameList', 'resetCondition'],
  components: {
      // UploadImg
  },
  data () {
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
      }, {
        id: 1,
        name: '使用中'
      }, {
        id: 2,
        name: '离线'
      }], // 设备类型列表
      userId: 0,
      userName: '',
      visible: false,
      isShowSelect: false,
      addMeal: {
        facilityName: '',
        equipmentId: this.selectDefault,
        ip: '',
        facilityStatus: 0,
        facilitySN: this.selectDefault,
        userName: '',
        mobile: '',
        facilityAddress: '',
        facilityPictures: '',
        isSet: 0
      },
      restaurantObj: {}, // 食堂对象
      org: [],
      activeIndex: 0,
      defaultProps: {
        pageSize: 10,
        pageIndex: 1
      },
      list: [],
      uploadUrl: window.$imgUrl,
      imgUrl: window.$imgUrlPrev,
      imageUrl: '',
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
          { validator: validateMobile, trigger: 'blur' }
        ],
        facilityAddress: [
          { required: true, message: '请输入设备地址', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    cateenInfo () {
      return this.$store.state.Account.cateenInfo
    }
  },
  mounted () {
    this.visible = true;
    this.init();
  },
  methods: {
    async init () {
      await this.initUserInfo();
      await this.$nextTick(() => {
        if (this.parentTitle == 2) {
          this.initFormData();
        }
      });
    },
    changeUserName(){
      this.datas.userName = this.addMeal.facilityName;
    },
    // 切换图片
    handleChange(file) {
        console.log(file);
        if (file.name) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.datas.UploadFile = file.raw;
        }
        this.loading = true;
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        let formData = new FormData();
        if (Object.keys(this.datas).length) {
            Object.keys(this.datas).forEach(key => {
                formData.append(key, this.datas[key]);
            });
        }
        axios
            .post(this.uploadUrl, formData, config)
            .then(res => {
                this.loading = false;
                if (res.data.status === 1) {
                  this.addMeal.facilityPictures = this.imgUrl + res.data.result;
                    // this.$message.closeAll();
                    // this.$message({
                    //     message: '上传成功！',
                    //     type: 'success',
                    // });
                    this.$forceUpdate(); //组件嵌套太深 无法自动更新 强制更新视图
                }
            })
            .catch(() => {
                that.$emit('setLoading', false);
            });
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
        this.$refs.upload.clearFiles();
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    // 验证IP地址
    validateIp (e) {
      const value = e;
      const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!value) {
        this.$message.closeAll();
        this.$message({
          message: 'IP地址不能为空',
          type: 'warn'
        });
        return false;
      } else if (ipReg.test(value)) {
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
    initUserInfo () {
      const user = localStorage.getItem("userInfo");
      if(user) {
        this.userId = JSON.parse(user).userId;
        this.userName = JSON.parse(user).userName;
        if(this.parentTitle === 1) {
          this.datas.userName = this.addMeal.facilityName;
        }else {
          this.datas.userName = this.parentCurrentMeal.FacilityName;
        }
        console.log(this.datas.userName);
        this.datas.userId = this.userId;
      }
      this.datas.FileName = 'shebei';
      this.datas.type = 2;
      this.restaurantObj = this.cateenInfo;
      if (Object.keys(this.restaurantObj).length) {
        this.addMeal.restaurantId = this.restaurantObj.id;
        this.datas.restaurantId = this.restaurantObj.id;
        this.datas.restaurantName = this.restaurantObj.name;
      }
    },
    // 编辑初始化表单
    initFormData () {
      let obj = JSON.parse(JSON.stringify(this.parentCurrentMeal));
      if (Object.keys(obj).length) {
        Object.keys(obj).forEach(item => {
          let formKey = item.replace(item[0], item[0].toLowerCase());
          this.addMeal[formKey] = obj[item];
        })
      }
      console.log(this.addMeal);
      if (Reflect.has(this.parentCurrentMeal, 'FacilityPictures')) {
        this.addMeal.facilityPictures = this.parentCurrentMeal.FacilityPictures;
        this.datas.sourcePath = this.parentCurrentMeal.FacilityPictures;
        this.imageUrl = this.parentCurrentMeal.FacilityPictures;
      }
    },
    //关闭弹框
    cancelModule (val) {
      this.$emit('cancelModule', val);
    },

    // 新增
    submitForm (formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.validateIp(that.addMeal.ip)) {
            this.mealSave();
          }
        } else {
          console.log('提交错误!');
          return false;
        }
      });
    },
    // 编辑
    submitEditForm (formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.validateIp(that.addMeal.ip)) {
            this.mealEdit();
          }
        } else {
          console.log('提交错误!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    // 添加
    mealSave () {
      this.org = this.addMeal.organization
      console.log(this.addMeal);
      const url = window.$facilityUrl + `api/Facility/FacilityAdd`;
      axios({ method: 'post', url: url, data: this.addMeal })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$emit('resetCondition');
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
    // 编辑设备信息
    mealEdit () {
      const url = window.$facilityUrl + `api/Facility/FacilityUpdate`;
      axios({ method: 'post', url: url, data: this.addMeal })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$emit('resetCondition');
            this.$emit('getParentTableData');
            this.$message({
              message: '编辑成功',
              type: 'success',
            });
            this.cancelModule(false)
          } else if (rsp.data.message) {
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
      handler (form) {
        if (this.isShowSelect) {
          this.$refs.selectTree.filter(addMeal.organization);
        }
      },
      deep: true,//深度监听，重要
    },
    cateenInfo: {
      handler (newValue) {
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
        .btnsLine .mt30 {
            margin-top: 30px;
        }
    }
    .objectTree {
        margin-left: 97px;
        position: absolute;
        overflow: auto;
        z-index: 100;
        height: 200px;
        border: 1px solid #ddd;
        line-height: normal;
        z-index: 204;
    }
    .width-220 {
        width: 220px;
    }
}
</style>