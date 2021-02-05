<template>
  <el-dialog class="commonDialog" :title="parentTitle === 1 ? '新增保养记录' : '编辑保养记录'" :visible.sync="visible"
    :close-on-click-modal="false" width="400px" v-loading="loading" element-loading-text="拼命上传中"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
    :before-close="cancelModule">
    <el-form ref="addMeal" :model="addMeal" :rules="rules" class="commonForm mt45" label-width="35%">
      <el-form-item label="设备类型:" prop="EquipmentId" required>
        <el-select class="commonSelect" v-model="addMeal.EquipmentId" placeholder="请选择" value-key="id" @change="changeNames">
          <el-option v-for="item in parentOptionsList" :key="item.id" :label="item.equimentTypeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称:" prop="FacilityName" required>
        <el-select class="commonSelect" v-model="addMeal.FacilityName" placeholder="请选择" value-key="id">
          <el-option v-for="(item, index) in nameList" :key="item.facilityName + index" :label="item.facilityName"
            :value="item.facilityName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备地址:" prop="FacilityAddress" required>
        <!-- <el-select class="commonSelect" v-model="addMeal.FacilityAddress" placeholder="请选择">
          <el-option :value="selectDefault" label="请选择">请选择</el-option>
          <el-option v-for="(item, index) in addressesList" :key="item.facilityAddress + index"
            :label="item.facilityAddress" :value="item.facilityAddress">
          </el-option>
        </el-select> -->
         <el-input class="commonInput" v-model="addMeal.FacilityAddress" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="负责人:" prop="UserName" required>
        <el-input class="commonInput" v-model="addMeal.UserName" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="保养时间:" prop="CreateTime" required>
        <el-date-picker v-model="addMeal.CreateTime" class="commonDatePicker" type="date" placeholder="保养时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保养内容:" prop="Remark" required>
        <el-input type="textarea" class="commonTextarea" v-model="addMeal.Remark" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item class="btnsLine mt30">
        <el-button class="commonButton" @click.native="cancelModule(false)">取消</el-button>
        <el-button class="commonButton" @click.native="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
        <el-button class="commonButton" @click.native="submitEditForm('addMeal')" v-else-if="parentTitle === 2">确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
export default {
  props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'parentOptionsList'],
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
        callback(new Error('请选择' + rule.tip));
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
      imgUrl: window.$imgUrl,
      imageUrl: '',       //上传图片url
      userId: 0,
      userName: '',
      visible: false,
      isShowSelect: false,
      addMeal: {
        FacilityName: '',
        EquipmentId: this.selectDefault,
        FacilityAddress: '',
        UserName: '',
        Remark: '',
      },
      restaurantObj: {}, // 食堂对象
      org: [],
      activeIndex: 0,
      defaultProps: {
        pageSize: 10,
        pageIndex: 1
      },
      addressesList: [],
      nameList: [],
      list: [],
      datas: {},
      rolesLists: [],
      rules: {
        FacilityName: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ],
        EquipmentId: [
          { validator: validateSelect, trigger: 'change', tip: '设备类型' }
        ],
        FacilityAddress: [
          { required: true,  message: '请输入设备地址', trigger: 'blur' }
        ],
        CreateTime: [
          { required: true, message: '请选择保养时间', trigger: 'blur' }
        ],
        Remark: [
          { required: true, message: '请输入保养内容', trigger: 'blur' }
        ],
        UserName: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
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
    this.initUserInfo();
    // 获取设备地址和类型
    this.getAddresses();
    // this.getNames();
    this.visible = true;
    if (this.parentTitle == 2) {
      this.initFormData();
    }
  },
  methods: {

    initUserInfo () {
      const user = localStorage.getItem("userInfo");
      if(user) {
        this.userId = JSON.parse(user).userId;
        this.userName = JSON.parse(user).userName;
        this.datas.userId = this.userId;
      }
      this.datas.userName = 'shebei';
      this.datas.FileName = 'shebei';
      this.datas.type = 2;
      this.restaurantObj = this.cateenInfo;
      if (Object.keys(this.restaurantObj).length) {
        this.addMeal.restaurantId = this.restaurantObj.id;
        this.datas.restaurantId = this.restaurantObj.id;
        this.datas.restaurantName = this.restaurantObj.name;
      }
    },
    //获取设备地址列表
    getAddresses () {
      const url = window.$facilityUrl + `api/Facility/FacilityGetAddress?RestaurantId=` + this.restaurantObj.id;
      axios({ method: 'post', url: url })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.addressesList = rsp.data.result;
          } else {
            console.log("获取设备名称和设备地址失败")
          }
        })
        .catch(err => console.log(err));
    },
    changeNames(val) {
      this.addMeal.FacilityName = '';
      if(val !== this.selectDefault) {
        this.getNames();
      }
    },
    //获取设备名称列表
    getNames () {
      const url = window.$facilityUrl + `api/MaintenanceRecord/MaintenanceRecordSelectName?equipmentId=` + this.addMeal.EquipmentId;
      axios({ method: 'post', url: url })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.nameList = rsp.data.result;
          } else {
            console.log("获取设备名称失败")
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑初始化表单
    initFormData () {
      let obj = JSON.parse(JSON.stringify(this.parentCurrentMeal));
      if (Object.keys(obj).length) {
        Object.keys(obj).forEach(item => {
          //let formKey = item.replace(item[0], item[0].toLowerCase());
          this.addMeal[item] = obj[item];
        })
      }
    },
    //关闭弹框
    cancelModule (val) {
      this.$emit('cancelModule', val);
    },
    //图片上传
    handleAvatarSuccess (res, UploadFile) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      this.imageUrl = window.$imgUrlPrev + res.result;
      if (this.addMeal.facilityPictures) {
        this.datas.sourcePath = this.addMeal.facilityPictures;
      } else {
        this.datas.sourcePath = this.imageUrl;
      }
      this.addMeal.facilityPictures = this.imageUrl;

    },
    // 封装一个判断图片文件后缀名的方法
    isImage (fileName) {
      if (typeof fileName !== 'string') return;
      let name = fileName.toLowerCase();
      return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
    },
    beforeAvatarUpload (file) {
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
    submitForm (formName) {
      this.addMeal.CreateTime = moment(this.addMeal.CreateTime).format('YYYY-MM-DD');
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
    submitEditForm (formName) {
      this.addMeal.CreateTime = moment(this.addMeal.CreateTime).format('YYYY-MM-DD');
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mealEdit();
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
      const url = window.$facilityUrl + `api/MaintenanceRecord/MaintenanceRecordAdd`;
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
    // 编辑保养记录信息
    mealEdit () {
      const url = window.$facilityUrl + `api/MaintenanceRecord/MaintenanceRecordUpdate`;
      axios({ method: 'post', url: url, data: this.addMeal })
        .then(rsp => {
          if (rsp.data.status == 1) {
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