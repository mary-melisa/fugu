<template>
    <div class="facility">
        <Breadcrumb :firstMenu="'设备管理'" :secondMenu="'设备列表'"/>
        <div class="search">
            <div class="fieldItem">
             <span>设备类型：</span>
             <el-select class="commonSelect"  v-model="conditionForm.equipmentId" placeholder="请选择">
                <el-option :value="selectDefault" label="请选择">请选择</el-option>
                <el-option
                v-for="item in optionsList"
                :key="item.id"
                :label="item.equipmentName"
                :value="item.id">
                </el-option>
            </el-select>
            </div>
            <div class="fieldItem">
             <span>设备状态：</span>
             <el-select class="commonSelect"  v-model="conditionForm.facilityStatus" placeholder="请选择">
                <el-option :value="selectDefault" label="请选择">请选择</el-option>
                <el-option
                v-for="item in facilityStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            </div>
            <br/>
            <div class="fieldItem">
             <span>设备地址：</span>
             <el-select class="commonSelect"  v-model="conditionForm.facilityAddress" placeholder="请选择">
                <el-option :value="selectDefault" label="请选择">请选择</el-option>
                <el-option
                v-for="(item, index) in addressesList"
                :key="item.facilityAddress + index"
                :label="item.facilityAddress"
                :value="item.facilityAddress">
                </el-option>
            </el-select>
            </div>
            <div class="fieldItem">
             <span>设备名称：</span>
             <el-select class="commonSelect"  v-model="conditionForm.facilityName" placeholder="请选择">
                <el-option :value="selectDefault" label="请选择">请选择</el-option>
                <el-option
                v-for="(item,index) in nameList"
                :key="item.facilityName + index"
                :label="item.facilityName"
                :value="item.facilityName">
                </el-option>
            </el-select>
            </div>
            <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <el-row :span="24" class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加</el-button>
            <el-button  icon="el-icon-delete" @click="del()">批量删除</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="conditionForm" v-on:setCurrentMeal="selectMeal" v-on:parentEdit="edit" v-on:parentDel="delsingle" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange" :parentOptionsList="optionsList" :nameList="nameList"/>
        </div>
        <FacilityAdd v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" :parentOptionsList="optionsList" v-on:getAddresses="getAddresses" :nameList="nameList" v-on:setPageIndexDefault="setPageIndexDefault" v-on:resetCondition="resetCondition"></FacilityAdd>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/facility/components/tableContent/tableContent.vue';
import FacilityAdd from '@/views/facility/components/facilityAdd/facilityAdd.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        FacilityAdd
    },
    data(){
        return{
            selectDefault: -1,
            defaultProps: {
                pageSize: 1000,
                pageIndex: 1
            },
            restaurantObj: {}, // 所属食堂
            conditionForm: {
                pageIndex: 1,
                pageSize: 10,
                equipmentId: this.selectDefault,
                ip: this.selectDefault,
                facilityStatus: this.selectDefault,
                facilityName: this.selectDefault,
                restaurantId: this.selectDefault,
                facilityAddress: this.selectDefault
            },
            addMeal:{
                name:'',
                mobile:'',

            },
            optionsList: [],  // 设备类型列表
            addressesList: [], // 设备地址列表
            nameList: [],      // 设备名称列表
            facilityStatusList: [{
                id: 1,
                name: '使用中'
            },{
                id: 0,
                name: '未使用'
            },{
                id: 2,
                name: '离线'
            }], 
            dialogFormVisible:false,
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
            restaurantObj: {}, // 食堂对象
        }
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo;
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        async init(){
            // 初始化用户信息并且获取分页表格信息
            await this.initUserInfo();
            // 获取设备类型
            await this.getEquitypes();
            // 获取分页表格数据
            if( this.restaurantObj.id) {
                this.getTableData();
            }
        },
        select(){
            this.conditionForm.pageIndex = 1;
            this.getTableData();
        },
        //获取设备类型
        getEquitypes(){
            const url = window.$facilityUrl + `api/FaciliType/getequitype`;
            axios({method: 'post', url: url, data: this.defaultProps})
            .then(rsp=>{
                if(rsp.data.status == 1){
                    this.optionsList = rsp.data.result;
                } else {
                    console.log("获取失败")
                }
            })
            .catch(err=> console.log(err));
        },
         //获取设备地址列表
        getAddresses(){
            const url = window.$facilityUrl + `api/Facility/FacilityGetAddress?RestaurantId=` + this.restaurantObj.id;
            axios({method: 'post', url: url})
            .then(rsp=>{
                if(rsp.data.status == 1){
                    this.addressesList = rsp.data.result;
                } else {
                    console.log("获取设备名称和设备地址失败")
                }
            })
            .catch(err=> console.log(err));
        },
         //获取设备名称列表
        getNames(){
            const url = window.$facilityUrl + `api/Facility/FacilityGetFacilityName?RestaurantId=` + this.restaurantObj.id;
            axios({method: 'post', url: url})
            .then(rsp=>{
                if(rsp.data.status == 1){
                    this.nameList = rsp.data.result;
                } else {
                    console.log("获取设备名称和设备地址失败")
                }
            })
            .catch(err=> console.log(err));
        },
       // 初始化用户信息
       initUserInfo(){
            this.restaurantObj = this.cateenInfo;
            this.conditionForm.restaurantId = this.restaurantObj.id;
             // 获取设备地址和类型
            this.getAddresses();
            this.getNames();
       },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
        // 导出
        educe(){

        },
        setPageIndexDefault(val) {
            this.conditionForm.pageIndex = val;
        },
        //获取表格数据
        getTableData(){
            let obj = {};
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            if(this.conditionForm.equipmentId != this.selectDefault) {
                obj.equipmentId = this.conditionForm.equipmentId;
            }
            if(this.conditionForm.facilityName != this.selectDefault) {
                obj.facilityName = this.conditionForm.facilityName;
            }
            if(this.conditionForm.facilityStatus != this.selectDefault) {
                obj.facilityStatus = this.conditionForm.facilityStatus;
            }
            if(this.conditionForm.facilityAddress != this.selectDefault) {
                obj.facilityAddress = this.conditionForm.facilityAddress;
            }
            if(this.conditionForm.restaurantId) {
                obj.restaurantId = this.conditionForm.restaurantId;
            }
            const url = window.$facilityUrl + `api/Facility/FacilitySelectPaging`;
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = JSON.parse(JSON.stringify(rsp.data));
                    console.log(this.result);
                } else{
                    this.$message.closeAll();
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
        },
      handleSizeChange(val) {
        this.conditionForm.pageSize = val;
        this.conditionForm.pageIndex = 1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.conditionForm.pageIndex = val;
        this.getTableData();
      },
        // 新增
      add() {
          this.title = 1;
          this.dialogVisible = true;
      },
      //编辑
      edit(rowObj) {
         this.title = 2;
         this.currentMeal = rowObj;
         this.dialogVisible = true;
      },
      //绑定手环
        bind(){
           this.dialogFormVisible = true
        },

      // 批量删除
      del(){
        this.$message.closeAll();
        if(!this.multipleSelection.length){
          this.$message({
              message: '请先选择一条数据',
              type: 'warn',
          });
        }else {
          this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteMeal();
          })
        }
      },
      // 重置表单和加载设备地址和名称
      resetCondition(){
            this.conditionForm.facilityAddress = this.selectDefault;
            this.conditionForm.facilityName = this.selectDefault;
            this.getAddresses();
            this.getNames();
      },
      //单个删除
      delsingle(rowObj){
          this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteFlag = 'single';
            this.deleteMeal(rowObj);
          })
      },
       //删除
       deleteMeal(rowObj) {
        let obj = {};
        let arr = [];
        if(this.deleteFlag === 'some') {
          this.multipleSelection.forEach(item => {
            arr.push(item.Id)
          });
        }else {
          arr.push(rowObj.Id);
        }
        if(arr.length) {
            obj.listId = arr;
        }
        obj.listRestaurant = [];
        if(this.restaurantObj.id) {
            obj.listRestaurant.push(this.restaurantObj.id);
        }
        console.log(obj);
        const url = window.$facilityUrl+`api/Facility/FacilityBatchDelete`;
        axios({ method: 'post', url: url,data: obj})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.conditionForm.pageIndex = 1;
                    // 获取设备地址和类型
                   this.resetCondition();
                   this.getTableData();
                   this.$message({
                        message: '删除成功！',
                        type: 'success',
                    });
                }else if(rsp.data.message){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
      },
      // 关闭模态框回调
      cancelModule(val) {
          this.dialogVisible = false;
      },
      // 当前选中餐别
      selectMeal(meal){
        this.currentMeal = meal;
        console.log(meal);
      }
    },
    watch: {
        cateenInfo: {
            handler(newValue){
                this.restaurantObj = newValue;
                this.conditionForm.restaurantId = this.restaurantObj.id;
                // 设备名称和设备地址重新赋值
                this.conditionForm.facilityAddress = this.selectDefault;
                this.conditionForm.facilityName = this.selectDefault;
                this.getAddresses();
                this.getNames();
                this.getTableData();
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
        .commonButton{
            color: #ffffff;
        }
    }
}
.facility {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .model{
       width: 100%;
    }
    .table{
        width: 100%;
        height: calc(100% - 243px);
    }
    .operBtns{
        border-bottom: 0;
        border-top: 1px solid #cccccc;
    }
    .topsearch{
        margin-bottom: 20px;
    }
    .search {
        ::v-deep.commonSelect {
            margin-bottom: 10px;
        }
    }
}
</style>