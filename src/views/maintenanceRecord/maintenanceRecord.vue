<template>
    <div class="maintenanceRecord">
        <Breadcrumb :firstMenu="'设备管理'" :secondMenu="'保养记录'"/>
        <div class="search">
             <div class="fieldItem">
                <span>设备类型:</span>
                <el-select class="commonSelect ml15"  v-model="conditionForm.EquipmentId" placeholder="请选择">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option
                    v-for="item in optionsList"
                    :key="item.id"
                    :label="item.equimentTypeName"
                    :value="item.id">
                    </el-option>
                </el-select>
             </div>
             <div class="fieldItem">
                <span>保养时间：</span>
                <el-date-picker
                    class="commonDatePicker"
                    v-model="conditionForm.StartTime"
                    type="date"
                    placeholder="开始时间">
                </el-date-picker>
                <span class="ml10 mr10">至</span>
                <el-date-picker
                    class="commonDatePicker"
                    v-model="conditionForm.EndTime"
                    type="date"
                    placeholder="结束时间">
                </el-date-picker>
            </div>
            <br/>
            <div class="fieldItem">
                <span>综合查询：</span>
                <el-input placeholder="请输入" class="commonInput" v-model="conditionForm.KeyContent" style="width: 200px;"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <el-row :span="24" class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加</el-button>
            <el-button  icon="el-icon-delete" @click="del()">批量删除</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="conditionForm" v-on:setCurrentMeal="selectMeal" v-on:parentEdit="edit" v-on:parentDel="delsingle" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange" :parentOptionsList="optionsList"/>
        </div>
        <MaintenaceAdd v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" :parentOptionsList="optionsList" v-on:setPageIndexDefault="setPageIndexDefault"></MaintenaceAdd>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/maintenanceRecord/components/tableContent/tableContent.vue';
import MaintenaceAdd from '@/views/maintenanceRecord/components/maintenaceAdd/maintenaceAdd.vue';
import moment from 'moment';
export default {
    components:{
        Breadcrumb,
        TableContent,
        MaintenaceAdd
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
                PageIndex: 1,
                PageSize: 10,
                StartTime: '',
                EndTime: '',
                KeyContent: '',
                EquipmentId: this.selectDefault
            },
            addMeal:{
                name:'',
                mobile:'',

            },
            optionsList: [],  // 设备类型列表
            addressesList: [], // 设备地址和设备名称列表
            dialogFormVisible:false,
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
            loading: null,
        }
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted(){
         // 初始化用户信息
        this.initUserInfo();
        // 获取设备地址和类型
        this.getAddresses();
        this.init();
    },
    methods:{
        async init(){
            // 获取设备类型
            await this.getEquitypes();
            // 获取分页表格信息
            await this.getTableData();
        },
        // 查询
        select(){
            this.conditionForm.PageIndex = 1;
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
         //获取设备地址和类型
        getAddresses(){
            let obj = {};
            if(this.restaurantObj.id) {
                obj.RestaurantId = this.restaurantObj.id;
            }
            const url = window.$facilityUrl + `api/Facility/FacilityGetAddress`;
            axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if(rsp.data.status == 1){
                    this.addressesList = rsp.data.result;
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
       },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
        // 导出
        educe(){

        },
        
        //日期部分处理
        formatDate_date(val, format){
            if (!val) return '';
            let fmt = format || 'YYYY-MM-DD';
            return moment(val).format(fmt);
        },
        setPageIndexDefault(val) {
            this.conditionForm.PageIndex = val;
        },
        //获取表格数据
        getTableData(){
            this.loading = this.$loading({
                lock: true,
                text: '查询中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let obj = {};
            if(this.conditionForm.EquipmentId != this.selectDefault) {
                obj.EquipmentId =  this.conditionForm.EquipmentId;
            }
            if(this.conditionForm.StartTime) {
                obj.StartTime =  this.formatDate_date(this.conditionForm.StartTime);
            }
            if(this.conditionForm.EndTime) {
                obj.EndTime =  this.formatDate_date(this.conditionForm.EndTime);
            }
            if(this.conditionForm.KeyContent) {
                obj.KeyContent =  this.conditionForm.KeyContent;
            }
            obj.PageIndex = this.conditionForm.PageIndex;
            obj.PageSize = this.conditionForm.PageSize;
            const url = window.$facilityUrl + `api/MaintenanceRecord/MaintenanceRecordSelectPaging`;
            axios({method: 'post',url: url, data: obj})
            .then(rsp=>{
                this.loading.close();
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                    this.result.result.forEach(item => {
                        let obj = this.optionsList.find(res => res.id === item.EquipmentId);
                        if(Object.keys(obj).length){
                            return item.equimentTypeName = obj.equimentTypeName;
                        }else {
                            return item.equimentTypeName = "";
                        }
                    })
                } else{
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => {
               this.loading.close();
                console.log(err);
            });
        },
        handleSizeChange(val) {
            //console.log(`每页 ${val} 条`);
            this.conditionForm.PageSize = val;
            this.conditionForm.PageIndex = 1;
            this.getTableData();
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            this.conditionForm.PageIndex = val;
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
            this.deleteFlag = 'some';
            this.deleteMeal();
          })
        }
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
        const url = window.$facilityUrl+`api/MaintenanceRecord/MaintenanceRecordDelete`;
        axios({ method: 'post', url: url,data: obj})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.conditionForm.PageIndex = 1;
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
.maintenanceRecord {
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