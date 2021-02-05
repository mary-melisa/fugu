<template>
  <el-dialog
    class="commonDialog"
    :title="parentTitle === 1 ? '新增套餐' : '编辑套餐'"
    :visible.sync="visible"
    v-loading="loading"
    element-loading-text="拼命上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    width="800px"
    :before-close="cancelModule">
    <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="40%">
      <el-row style="margin-top:-30px">
        <el-col :span="12" style="margin-left:-50px;">
          <el-form-item label="套餐名称:" prop="setMealName" required>
            <el-input class="commonInput" v-model="addMeal.setMealName" :disabled='false'
                      style="heigth:100px" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别:" prop="dishesCategoryId" required>
            <el-select class="commonSelect" v-model="addMeal.dishesCategoryId">
                <el-option :value="selectDefault" label="请选择">请选择</el-option>
                <el-option v-for="item in cla" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>   
      </el-row> 
      <el-row>
        <el-col :span="20" style="margin-left:-150px">
            <el-form-item label="套餐内容:" required>
                <el-input v-model="dishesListNames" class="commonInput" type="textarea" :rows="4" style="width:465px" readonly></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-left:60px">
            <el-button type="text" v-model="addMeal.list" @click="selectDishes" style="float:right;margin-top:60px">
                    添加菜品
            </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-left:-50px">
          <el-form-item label="价格:" prop="price" required>
            <el-input type="number" class="commonInput"  :min="0" @input.native="onInput0"  v-model="addMeal.price" maxlength="10"
                      style="width: 465px;margin-right:5px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-left:-50px;margin-top:5px">
          <el-form-item label="套餐图片:">      
            <div class="uploadImg">
              <el-upload 
                ref="upload"
                class="avatar-uploader" 
                accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp"
                :action="imgUrl"
                :data="datas"
                name="UploadFile"
                :show-file-list="false" 
                :on-success="handleAvatarSuccess" 
                :before-upload="beforeAvatarUpload">
                <el-image  v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btnsLine mt60">
        <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
        <el-button class="commonButton" @click="submitAdd('addMeal')">确定</el-button>
      </el-form-item>
    </el-form>
    <AddCuisine v-if="dialogVis" v-on:closeParentModule="closeModule"
                      :parentMultipleSelection="multipleSelection" v-on:parentSetMultiple="setMultiple" :parentDishes="dishes" :cla="cla"></AddCuisine>
  </el-dialog>
</template>

<script>
  import axios from 'axios';
  import AddCuisine from '@/views/packageManagement/components/addPackages/addCuisine.vue';
  export default {
    props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'setPageIndexDefault'],
    components: {
      AddCuisine
    },
    data() {
      var validateSelect = (rule, value, callback) => {
        if (value == -1) {
          callback(new Error('请选择类别'));
        } else {
          callback();
        }
      };
       var validateLength = (rule, value, callback) => {
        if (!value.length) {
          callback(new Error('请选择套餐'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        selectDefault: -1,
        imgUrl: window.$imgUrl,
        imageUrl: '',
        userId: 0,
        userName: '',
        visible: false,
        cla: [],
        dishesListNames: '',
        dialogVis: false,   //物料窗口控制
        multipleSelection: [], // 选中的菜品列表
        addMeal: {},
        dishes: [], // 菜品列表
        rules: {
          setMealName: [
            { required: true, message: '请输入套餐名称', trigger: 'blur' }
          ],
          dishesCategoryId: [
           { validator: validateSelect, trigger: 'change'}
          ],
          list: [
            { validator: validateLength, trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ],
        },
        conditionForm: {    //获取菜品类别的参数
          pageIndex: 1,
          pageSize: 10000,
        },
        datas: {},
        restaurantObj: {} // 所属食堂
      };
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted() {
      this.initUserInfo();
      this.getTerpineCla();
      this.visible = true;
      if (this.parentTitle === 2) {
        this.initFormData();
      }
    },
    methods: {
      onInput0(e) {
          this.$message.closeAll();
          if (e.target.value < 0) {
              this.$message.warning("只能输入大于0的数");
              e.target.value = null;
          }
      },
      initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          if(user) {
            this.userId = JSON.parse(user).userId;
            this.userName = JSON.parse(user).userName;
          }
          this.datas.userName =  'taocan';
          this.datas.FileName = 'taocan';
          this.datas.userId = this.userId;
          this.datas.type = 2;
          this.restaurantObj = this.cateenInfo;
          if(this.restaurantObj.id) {
              this.addMeal.restaurantId = this.restaurantObj.id; 
              this.datas.restaurantId = this.restaurantObj.id;
              this.datas.restaurantName = this.restaurantObj.name;
          }
       },
      // 添加菜品
      submitAdd(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.addMeal.list = [];
              if(this.multipleSelection.length) {
                this.multipleSelection.forEach(item => {
                  this.addMeal.list.push({
                    id: item.id,
                    quantity: item.quantity
                  })
                })
                 this.submitForm();
              }else {
                this.$message.closeAll();
                this.$message({
                  message: '请选择套餐',
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
        const url = window.$config2 + `api/SetMealManagement/VarietyOfDishesSave`;
        let obj = {};
        Object.keys(this.addMeal).forEach(key => {
            if(this.addMeal[key]) {
                obj[key] = this.addMeal[key];
            }
        })
        if(this.parentTitle === 2) {
          obj.id = this.parentCurrentMeal.id;
        }
        if(this.imageUrl){
          obj.mealPictures = this.imageUrl;
        }
        this.$message.closeAll();
        axios({ method: 'post', url: url, data: obj })
          .then(rsp => {
            if (rsp.data.status == 1) {
              if(this.parentTitle === 1) {
                this.$emit('setPageIndexDefault', 1);
              }
              this.$emit('getParentTableData');
              this.$message({
                message: this.parentTitle === 1 ? '添加成功' : '编辑成功',
                type: 'success',
              });
              this.$emit('cancelModule', false);
            } else if(rsp.data.message){
              this.$message({
                message: rsp.data.message,
                type: 'error',
              });
            }
          })
          .catch(err => console.log(err));
      },
      //关闭弹框
      closeDialog(val) {
        this.$emit('cancelModule', val);
      },
      // 菜品列表
      setMultiple(list) {
        this.multipleSelection = list;
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
      //添加菜品
      selectDishes() {
        this.dialogVis = true;
      },
      //获取图片
      handleAvatarSuccess(res, file) {
        this.loading = false;
        this.$refs.upload.clearFiles();
        this.imageUrl = window.$imgUrlPrev + res.result;
        this.addMeal.mealPictures = this.imageUrl;
        this.datas.sourcePath = this.imageUrl;
      },
      // 封装一个判断图片文件后缀名的方法
        isImage(fileName) {
            if (typeof fileName !== 'string') return;
            let name = fileName.toLowerCase();
            return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
        },
        beforeAvatarUpload(file) {
            this.loading = true;
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
      // 获取菜品类别
      getTerpineCla() {
        const url = window.$config1 + `api/bddishescategory/getdishescategory`;
        axios({ method: 'post', url: url, data: this.conditionForm })
          .then(res => {
            this.cla = res.data.result;
          });
      },
      // 编辑初始化表单
     async initFormData() {
      //  await this.getDishes();
        this.addMeal = JSON.parse(JSON.stringify(this.parentCurrentMeal));
        this.addMeal.dishesCategoryId = Number(this.parentCurrentMeal.dishesCategoryId);
        if(this.addMeal.mealPictures) {
          this.imageUrl = this.addMeal.mealPictures;
          this.datas.sourcePath = this.imageUrl;
        }
        if(this.addMeal.list.length) {
          const that = this;
          this.dishes = [];
          this.dishesNames = "";
          this.addMeal.list.forEach(item => {
            let dish = {};
            dish.id = item.id;
            if(item && Object.keys(item).length) {
              that.dishesNames += (item.dishesName ? item.dishesName : "") + "," + item.categoryName + ',' + item.quantity + "\n";
              dish.dishesName = item.name;
              dish.categoryName = item.categoryName;
              dish.quantity = item.quantity;
            }
            this.dishes.push(dish);
          })
          // 初始化菜品列表
          this.setMultiple(this.dishes);
        }
      },
      //关闭弹框
      cancelModule(val) {
        this.setMultiple([]);
        this.$emit('cancelModule', val);
      },
    },
    watch: {
      multipleSelection: {
         handler: function (value) {
             this.dishesListNames = "";
             this.addMeal.list = [];
             if(value.length) {
               value.forEach(item => {
                 this.dishesListNames += item.dishesName + "," + item.categoryName + ',' + item.quantity + "\n";
                 let obj = {
                   id: item.id,
                   quantity: item.quantity
                 }
                 this.addMeal.list.push(obj);
               })
             }
          },
          deep: true
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
