<template>
  <el-dialog
    class="commonDialog"
    :title="parentTitle === 1 ? '添加菜品' : '编辑菜品'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-text="拼命上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    width="800px"
    :before-close="closeDialog" style="z-index:3">
    <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="40%">
      <el-row style="margin-top:-30 px">
        <el-col :span="12" style="margin-left:-50px;">
          <el-form-item label="菜品名称:" prop="dishesName" required>
            <el-input class="commonInput" v-model="addMeal.dishesName" :disabled='false' placeholder="请输入菜品名称"
                      style="heigth:100px" maxlength="50" @input="changeUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜品类别:" prop="dishesCategoryId" required>
            <el-select class="commonSelect" v-model="addMeal.dishesCategoryId">
                <el-option :value="selectDefault">请选择</el-option>
                <el-option v-for="item in cla" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" style="margin-left:-150px">
            <el-form-item label="物料:" required>
                <el-input  class="commonInput" type="textarea" v-model="dishesNames" :rows="4" style="width:465px" readonly></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-left:60px">
            <el-button type="text" v-model="addMeal.dishesList" @click="selectDishes" style="float:right;margin-top:60px">
                    选择物料
            </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-left:-50px">
          <el-form-item label="菜品净含量:" prop="netContent" required>
            <el-input type="number" class="commonInput" v-model="addMeal.netContent" placeholder="菜品净含量" disabled
                      style="width: 100px;margin-right:5px;"></el-input>
            g/份
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格:" prop="price" required>
            <el-input type="number" class="commonInput" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"  v-model="addMeal.price" placeholder="请输入价格" style="width: 198px;" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-left:-50px;margin-top:5px">
          <el-form-item label="菜品图片:">
            <div class="uploadImg">
                <!-- <UploadImg :loading="loading" v-on:setLoading="setLoading" v-on:parentLoad="parentLoad" :datas="datas"  v-on:setPhotos="setPhotos"/> -->
                <el-upload ref="upload" accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp" :action="uploadUrl" :data="datas" name="UploadFile" class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <!-- <div class="delBar" v-if="imageUrl"><i class="el-icon-delete delIcon"></i></div> -->
                </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btnsLine mt60">
        <el-button class="commonButton" @click="closeDialog">取消</el-button>
        <el-button class="commonButton" @click="submitAdd('addMeal')">确定</el-button>
      </el-form-item>
    </el-form>
    <SelectDishesList ref="selectDishes" v-if="dialogVis" v-on:closeParentModule="closeModule"
                      :parentMultipleSelection="multipleSelection" v-on:parentSetMultiple="setMultiple" v-on:parentCloseModule="closeModule" :parentDishes="dishes" v-on:setNetContent="setNetContent"></SelectDishesList>
  </el-dialog>
</template>

<script>
  import axios from 'axios';
  import SelectDishesList from '@/views/dishManagement/components/addClass/selectDishesList.vue';
  import UploadImg from "@/components/uploadImg/uploadImg.vue";
  export default {
    props: ['cancelModule', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'setPageIndexDefault'],
    components: {
      SelectDishesList,
      UploadImg
    },
    data() {
      return {
        loading: false,
        dishes: [], // 编辑物料列表
        dishesNames: '',   // 物料列表
        multipleSelection: [], // 选中的物料列表
        selectDefault: -1,
        visible: false,
        cla: [],  // 菜品类别
        uploadUrl: window.$imgUrl,
        imgUrl: window.$imgUrlPrev,
        imageUrl: '',
        dialogImageUrl: '',
        dialogVis: false,   //物料窗口控制
        addMeal: {
          restaurantId: 1,
          dishesName: '',
          netContent: 0,
          price: 0,
          remark: '',
          dishesPictures: '',
          dishesCategoryId: '',
          dishesList: []
        },
        datas: {},
        rules: {
          dishesName: [
            { required: true, message: '请输入菜品名称', trigger: 'blur' },
          ],
          dishesCategoryId: [
            { required: true, message: '请输入菜品类别', trigger: 'blur' },
          ],
          dishesList: [
            { required: true, message: '请先选择物料', trigger: 'blur' },
          ],
          netContent: [
            { required: true, message: '请输入菜品净含量', trigger: 'blur' },
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
          ],
        },
        conditionForm: {    //获取菜品类别的参数
          pageIndex: 1,
          pageSize: 10,
        },
        userId: 0,
        userName: '',
        restaurantObj: {} // 所属食堂
      };
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted() {
      this.visible = true;
      this.getTerpineCla();
      if (this.parentTitle === 2) {
        this.initFormData();
      }
      // 初始化用户信息
      this.initUserInfo();
    },
    methods: {
      changeUserName(){
        this.datas.userName = this.addMeal.dishesName;
      },
      onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
        setNetContent(val) {
          this.addMeal.netContent = val;
        },
         // 初始化用户信息
       initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          if(user){
            this.userId = JSON.parse(user).userId;
            this.userName = JSON.parse(user).userName;
            if(this.parentTitle === 1) {
              this.datas.userName =  this.addMeal.dishesName;
            }else {
              this.datas.userName =  this.parentCurrentMeal.dishesName;
            }
            this.datas.userId = this.userId;
          }
          this.datas.type = 2;
          this.datas.FileName = 'caipin';

          this.restaurantObj = this.cateenInfo;
          if(Object.keys(this.restaurantObj).length) {
            this.addMeal.restaurantId=this.restaurantObj.id;
            this.datas.restaurantId = this.restaurantObj.id;
            this.datas.restaurantName = this.restaurantObj.name;
          }
       },
      // 选中的物料
      setMultiple(val){
        // this.multipleSelection = Array.from(new Set(val));
        const res = new Map();
        this.multipleSelection =  val.filter((val) => !res.has(val.id) && res.set(val.id, 1));
      },
      submitAdd(formName){
        this.addMeal.dishesList = [];
        this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.multipleSelection.length) {
                this.multipleSelection.forEach(item => {
                  this.addMeal.dishesList.push({
                    id: item.id,
                    suttle: item.materialUnit
                  })
                })
                 this.submitForm();
              }else {
                this.$message.closeAll();
                this.$message({
                  message: '请选择物料',
                  type: 'warn'
                })
              }
            } else {
                console.log('提交错误!');
                return false;
            }
            });
      },
      // 添加菜品
      submitForm() {
        const url = window.$config2 + `api/VarietyOfDishes/VarietyOfDishesSave`;
        let obj = {};
        Object.keys(this.addMeal).forEach(key => {
            if(this.addMeal[key]) {
                obj[key] = this.addMeal[key];
            }
        })
        if(this.parentTitle === 2) {
          obj.id = this.parentCurrentMeal.id;
        }
        axios({ method: 'post', url: url, data: obj })
          .then(rsp => {
            if (rsp.data.status == 1) {
              this.$message({
                message: this.parentTitle === 1 ? '添加成功' : '编辑成功',
                type: 'success',
              });
              if(this.parentTitle === 1) {
                this.$emit('setPageIndexDefault', 1);
              }
              this.$emit('getParentTableData');
              this.$emit('cancelModule', false);
            }else if(rsp.data.message == "重复新增"){
              this.$message({
                message: this.parentTitle === 1 ? '添加失败，已存在该菜品' : '编辑失败，已存在该菜品',
                type: 'error',
              });
            }else {
              this.$message({
                message: this.parentTitle === 1 ? '添加失败' : '编辑失败',
                type: 'error',
              });
            }
          })
          .catch(err => console.log(err));
      },
      //关闭弹框
      closeDialog() {
        this.$emit('cancelModule', false);
      },
      closeModule(val) {
        this.dialogVis = val;
      },
      selectNutrients(arr) {
        console.log(arr)
        arr.forEach((item,index)=>{
          this.addMeal.dishesList[index].id = item.id;
          this.addMeal.dishesList[index].suttle = Number(item.materialStatus);
        })

      },
      handleRemove(file, fileList) {
          console.log(file, fileList);
          this.$refs.upload.clearFiles();
      },
      handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
      },
      //选择物料
      selectDishes() {
        this.dialogVis = true;
      },
      // 切换图片
      handleChange(file) {
          if(this.parentTitle === 1) {
            if(!this.addMeal.dishesName) {
              this.$message.closeAll();
              this.$message({
                message: '请先输入菜品名称',
                type: 'warn'
              })
              return false;
            }
          }
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
                  this.addMeal.dishesPictures = this.imgUrl + res.data.result;
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
      //图片上传
        // handleAvatarSuccess(res, UploadFile) {
        //     this.loading = false;
        //     this.$refs.upload.clearFiles();
        //     this.imageUrl = window.$imgUrlPrev + res.result;
        //     this.addMeal.dishesPictures = this.imageUrl;
        //     this.datas.sourcePath = this.imageUrl;
        // },
        // // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {
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
        // 获取物料类别下拉列表
        getNutrients() {
           const url= window.$config1 + `api/bdmaterial/getmaterial`;
            axios({method: 'post', url: url})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.adddishesList = rsp.data.result;
                } else if(rsp.data.status == 0){
                    this.$message.closeAll();
                    this.$message({
                        message: rsp.data.message,
                        type: 'error'
                    });
                }
            })
            .catch(err=> console.log(err));
        },
      // 获取菜品类别
      getTerpineCla() {
        const url = window.$config1 + `api/bddishescategory/getdishescategory`;
        axios({ method: 'post', url: url, data: this.conditionForm })
          .then(res => {
            this.cla = res.data.result;
          });
      },
      // 编辑初始化表单
      initFormData() {
        this.addMeal = JSON.parse(JSON.stringify(this.parentCurrentMeal));
        this.addMeal.dishesCategoryId = Number(this.parentCurrentMeal.dishesCategoryId);
        if(this.addMeal.dishesPictures){
          this.imageUrl = this.addMeal.dishesPictures;
          this.datas.sourcePath = this.imageUrl;
        }
        if(this.addMeal.dishesList.length) {
          const that = this;
          this.dishes = [];
          this.dishesNames = "";
          this.addMeal.dishesList.forEach(item => {
            let dish = {};
            dish.id = item.id;
            if(item && Object.keys(item).length) {
              that.dishesNames += (item.categoryName ? item.categoryName : "") + "," + item.name + ',' + item.suttle + "g\n";
              dish.materialCategoryName = item.categoryName;
              dish.materialName = item.name;
              dish.materialUnit = item.suttle;
            }
            this.dishes.push(dish);
          })
          console.log(this.dishes);
          // 初始化物料列表
           this.setMultiple(this.dishes);
        }
      }
    },
    watch: {
      multipleSelection: {
         handler: function (value) {
             this.dishesNames = "";
             value.forEach(item => {
               this.dishesNames += item.materialCategoryName + "," + item.materialName + ',' + item.materialUnit + "g\n";
             })
          },
          deep: true
      },
      cateenInfo: {
            handler(newValue){
                this.restaurantObj = newValue;
                this.addMeal.restaurantId=this.restaurantObj.id;
                this.datas.restaurantId = this.restaurantObj.id;
                this.datas.restaurantName = this.restaurantObj.name;
                this.getTableData();
            },
            deep: true
        }
    }
  };
</script>
<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
