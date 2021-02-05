<template>
  <el-dialog
    class="commonDialog"
    :title="parentTitle === 1 ? '添加备菜计划' : '编辑备菜计划'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="800px"
    :before-close="closeDialog">
    <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="40%">
        <el-row style="margin-top:-30 px">
            <el-col :span="12" style="margin-left:-50px;">
                <el-form-item label="日期:" prop="planTime" required>
                    <el-date-picker class="commonTimePicker" placeholder="请选择日期"  v-model="addMeal.planTime"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="餐别:" prop="categoryType" required>
                <el-select class="commonSelect" v-model="addMeal.categoryType">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in categoryTypeList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
                </el-select>
            </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12" style="margin-left:-50px">
                <el-form-item label="所属食堂:" required>
                    <el-input class="commonInput" v-model="restaurantName"
                        style="width: 200px;margin-right:5px;" disabled></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="20" style="margin-left:-150px">
                <el-form-item label="选择菜品:" prop="dishesList">
                    <el-input  class="commonInput" type="textarea" v-model="dishesListNames" :rows="4" style="width:465px" readonly></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4" style="margin-left:60px">
                <el-button type="text"  @click="selectDishes" style="float:right;margin-top:60px">
                        选择菜品
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" style="margin-left:-150px">
                <el-form-item label="选择套餐:" prop="setMealList">
                    <el-input  class="commonInput" type="textarea" v-model="setMealListNames" :rows="4" style="width:465px" readonly></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4" style="margin-left:60px">
                <el-button type="text"  @click="selectSetMeal" style="float:right;margin-top:60px">
                        选择套餐
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="20" style="margin-left:-150px">
                <el-form-item label="备注:" prop="remark">
                    <el-input  class="commonInput" type="textarea" v-model="addMeal.remark" :rows="4" style="width:465px"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
         <el-input  v-model="addMeal.restaurantId"
                        type="hidden"></el-input>
      <el-form-item class="btnsLine mt60">
        <el-button class="commonButton" @click="closeDialog">取消</el-button>
        <el-button class="commonButton" @click="submitAdd('addMeal')">确定</el-button>
      </el-form-item>
    </el-form>
    <!-- 菜品选择 -->
    <SelectCaipin v-if="dialogVis" v-on:closeParentModule="close" v-on:parentSetDishList="setDishList" :dishMultipleSelection="dishMultipleSelection"
                      ></SelectCaipin>
    <!-- 选择套餐 -->
    <AddJihua v-if="dialogVisSetMeal" v-on:closeParentModule="closeModule" v-on:parentSetMealList="setMealList" :mealMultipleSelection="mealMultipleSelection"
                      ></AddJihua>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import SelectCaipin from '@/views/dishPreparation/components/addPrepareFood/selectCaipin.vue';
import AddJihua from '@/views/dishPreparation/components/addPrepareFood/addJihu.vue';
import moment from 'moment';

  export default {
    props: ['getTableData', 'cancelModule', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'setPageIndex'],
    components: {
      SelectCaipin,
      AddJihua
    },
    data() {
      var validateCategoryType = (rule, value, callback) => {
        if (value === -1) {
          callback(new Error('请选择餐别'));
        } else {
          callback();
        }
      };
      return {
        selectDefault: -1,
        urlPrev:  window.$config2,
        setMealListNames: "",  // 套餐列表描述 
        dishesListNames: "",   // 菜品列表描述
        visible: true,
        categoryTypeList: [{
          id: 1,
          name: '早餐'
        },{
          id: 2,
          name: '中餐'
        },{
          id: 3,
          name: '晚餐'
        }],
        resultList: [], // 菜品列表
        resultList1: [], // 套餐列表
        mealMultipleSelection: [], // 选中的菜品列表
        dishMultipleSelection: [], // 选中的套餐列表
        urlCla:  window.$config1,
        dialogVis: false,   //选择菜品窗口控制
        dialogVisSetMeal:false,
        addMeal: {
          planTime: new Date(),
          categoryType: this.selectDefault,
          setMealList: [],
          dishesList: []
        },
        rules: {
          planTime: [
            { required: true, message: '请选择日期', trigger: 'change' },
          ],
          categoryType: [
            { validator: validateCategoryType, trigger: 'change'}
          ]
        },
        conditionForm: {    //获取菜品类别的参数
          pageIndex: 1,
          pageSize: 10000,
        },
        restaurantObj: {}, // 所属食堂
        restaurantName: "", // 所属食堂名称
      };
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted() {
        this.initUserInfo();
        if (this.parentTitle === 2) {
          this.initFormData();
        }
    },
    methods: {
      // 初始化用户信息
      initUserInfo(){
        this.restaurantObj = this.cateenInfo;
        this.restaurantName = this.restaurantObj.name;
        this.addMeal.restaurantId=this.restaurantObj.id;
      },
       //获取菜品列表数据
        async getMeals(){
            let obj = {};
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            const url= this.urlPrev + `api/VarietyOfDishes/GetVarietyOfDishesPageList`;
            await axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                     // 解决翻页的时候复选框被取消的问题
                        let rows = rsp.data.result;
                        this.dishMultipleSelection.forEach(item => {
                            if(item && item.quantity){
                                let obj = rows.find(res => res.id === item.id);
                                if(obj && Object.keys(obj).length){
                                    obj['quantity'] = item.quantity;
                                }
                            }
                        })
                        this.resultObj = rsp.data;
                        this.resultObj.result = rows;
                } else{
                    this.$message( {
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err=> console.log(err));
        },
        //获取套餐表格数据
        async getSetMealsData(){
            let obj = {};
            obj.pageIndex = 1;
            obj.pageSize = 10000;
            const url= this.urlPrev+`api/SetMealManagement/GetSetMealManagementPageList`;
            await axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                     this.resultList1 = rsp.data.result;
                } else{
                    this.$message( {
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err=> console.log(err));
        },
      // 切换套餐列表状态
      setMealList(list) {
        this.mealMultipleSelection = list;
      },
      // 切换菜品列表状态
      setDishList(list) {
        this.dishMultipleSelection = list;
      },
      // 提交表单之前的验证
      submitAdd(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let mealFlag = false;
              let dishFlag = false;
              // 套餐列表
              if(this.mealMultipleSelection.length) {
                mealFlag = true;
                this.addMeal.setMealList = [];
                this.mealMultipleSelection.forEach(item => {
                  this.addMeal.setMealList.push({
                    id: item.id,
                    quantity: item.quantity
                  })
                })
              }//else {
              //   mealFlag = false;
              //   this.$message.closeAll();
              //   this.message({
              //     message: '请选择至少一种套餐',
              //     type: 'warn'
              //   })
              // }
              // 菜品列表
              if(this.dishMultipleSelection.length) {
                dishFlag = true;
                this.addMeal.dishesList = [];
                this.dishMultipleSelection.forEach(item => {
                  this.addMeal.dishesList.push({
                    id: item.id,
                    quantity: item.quantity
                  })
                })
                if(mealFlag || dishFlag) {
                  this.submitForm();
                }else {
                  this.$message({
                    message: "请选择至少一种菜品或者一种套餐",
                    type: 'warn'
                  })
                }
              }
              // else {
              //   dishFlag = false;
              //   this.$message.closeAll();
              //   this.message({
              //     message: '请选择至少一种菜品',
              //     type: 'warn'
              //   })
              // }
            } else {
                console.log('提交错误!');
                return false;
            }
            });
      },
      // 添加备菜计划
      submitForm() {
        let obj = {};
        Object.keys(this.addMeal).forEach(key => {
          if(this.addMeal[key]) {
            if(key === 'planTime') {
              obj[key] = moment(this.addMeal[key]).format('YYYY-MM-DD');
            }else {
              obj[key] = this.addMeal[key];
            }
          }
        })
        console.log(obj);
        const url = window.$config2 + `api/DishesPlan/DishesPlanSave`;
        axios({ method: 'post', url: url, data: obj })
          .then(rsp => {
            if (rsp.data.status == 1) {
              this.$message({
                message: this.parentTitle === 1 ? '添加成功' : '编辑成功',
                type: 'success',
              });
              if(this.parentTitle === 1) {
                this.$emit('setPageIndex', 1);
              }
              this.$emit('getTableData');
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
      closeDialog() {
        this.$emit('cancelModule', false);
      },
      selectNutrients(arr) {
        console.log(arr)
        arr.forEach((item,index)=>{
          this.addMeal.dishesList[index].id = item.id;
          this.addMeal.dishesList[index].suttle = Number(item.materialStatus);
        })

      },
      //选择物料
      selectDishes() {
        this.dialogVis = true;
      },
        //选择套餐
      selectSetMeal() {
        this.dialogVisSetMeal = true;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt10M;
      },
       //获取菜品数据
        async getDishesData(){
            let obj = {};
            obj.pageIndex = 1;
            obj.pageSize = 10000;
            const url= this.urlPrev + `api/VarietyOfDishes/GetVarietyOfDishesPageList`;
            await axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                     this.resultList = rsp.data.result;
                } else{
                    this.$message( {
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err=> console.log(err));
        },

      // 编辑初始化表单
    initFormData() {
        this.addMeal = JSON.parse(JSON.stringify(this.parentCurrentMeal));
        this.addMeal.categoryType = Number(this.parentCurrentMeal.categoryType);
        if(this.addMeal.dishesList.length) {
          const that = this;
          this.dishes = [];
          this.dishesNames = "";
          this.addMeal.dishesList.forEach(item => {
            let dish = {};
            dish.id = item.id;
            if(item && Object.keys(item).length) {
              that.dishesNames += (item.name ? item.name : "") + "," + item.categoryName + ',' + item.quantity + "\n";
              dish.dishesName = item.name;
              dish.categoryName = item.categoryName;
              dish.quantity = item.quantity;
            }
            this.dishes.push(dish);
          })
          // 初始化菜品列表
          this.setDishList(this.dishes);
        }

        if(this.addMeal.setMealList.length) {
            const that = this;
            this.meals = [];
            this.setMealListNames = "";
            this.addMeal.setMealList.forEach(item => {
              let setMeal = {};
              setMeal.id = item.id;
              if(item && Object.keys(item).length) {
                that.setMealListNames += (item.name ? item.name : "") + "," + item.categoryName + ',' + item.quantity + "\n";
                setMeal.setMealName = item.name;
                setMeal.categoryName = item.categoryName;
                setMeal.quantity = item.quantity;
              }
              this.meals.push(setMeal);
          })
          // 初始化套餐列表
          this.setMealList(this.meals);
        }
      },
      // 关闭菜品弹框
      close(val) {
        this.dialogVis = val;
      },
      // 关闭套餐弹窗
      closeModule(val){
        this.dialogVisSetMeal = val;
      }
    },
    watch: {
      restaurantObj: {
        handler: function (newValue, oldValue) {
            if(newValue!==oldValue){
               this.restaurantName = newValue.name;
            }
        }
      },
      dishMultipleSelection: {
         handler: function (value) {
             this.dishesListNames = "";
             this.addMeal.dishesList = [];
             if(value.length) {
               value.forEach(item => {
                 this.dishesListNames += item.dishesName + "," + item.categoryName + ',' + item.quantity + "\n";
                 let obj = {
                   id: item.id,
                   quantity: item.quantity
                 }
                 this.addMeal.dishesList.push(obj);
               })
             }
          },
          deep: true
      },
      mealMultipleSelection: {
         handler: function (value) {
             this.setMealListNames = "";
             this.addMeal.setMealList = [];
             if(value.length) {
               value.forEach(item => {
                 this.setMealListNames += item.setMealName + "," + item.categoryName + ',' + item.quantity + "\n";
                 let obj = {
                   id: item.id,
                   quantity: item.quantity
                 }
                 this.addMeal.setMealList.push(obj);
               })
             }
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
