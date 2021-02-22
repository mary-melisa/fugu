<template>
    <div class="runninglog">
        <Breadcrumb :firstMenu="'设备管理'" :secondMenu="'运行日志'"/>
        <div class="search">
             <div class="fieldItem">
                <span>设备类型:</span>
                <el-select class="commonSelect ml15"  v-model="conditionForm.equipmentId" placeholder="请选择">
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
                <span>设备名称：</span>
                <el-select class="commonSelect"  v-model="conditionForm.facilityName" placeholder="请选择">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option
                    v-for="item in addressesList"
                    :key="item.facilityName"
                    :label="item.facilityName"
                    :value="item.facilityName">
                    </el-option>
                </el-select>
            </div>
             <div class="fieldItem">
                <span>日志内容：</span>
                <el-input placeholder="请输入" class="commonInput" v-model="conditionForm.remark" style="width: 200px;"> </el-input>
            </div>
             <div class="fieldItem">
                <span>日志时间：</span>
                <el-date-picker
                    class="commonDatePicker"
                    v-model="conditionForm.StartTime"
                    type="datetime"
                    placeholder="开始时间">
                </el-date-picker>
                <span class="ml10 mr10">至</span>
                <el-date-picker
                    class="commonDatePicker"
                    v-model="conditionForm.EndTime"
                    type="datetime"
                    placeholder="结束时间">
                </el-date-picker>
            </div>
            <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="conditionForm" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange" :parentOptionsList="optionsList"/>
        </div>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/runninglog/components/tableContent/tableContent.vue';
import moment from 'moment';

export default {
    components:{
        Breadcrumb,
        TableContent,
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
                StartTime: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
                EndTime: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
                remark: '',
                equipmentId: this.selectDefault,
                facilityName: this.selectDefault,
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
            deleteFlag: 'some' // 'some'批量删除   'single' 单个删除
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
        // 获取设备地址和名称
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
            this.conditionForm.pageIndex = 1;
            this.getTableData();
        },
        //获取设备类型
        async getEquitypes(){
            const url = window.$facilityUrl + `api/FaciliType/getequitype`;
            await axios({method: 'post', url: url, data: this.defaultProps})
            .then(rsp=>{
                if(rsp.data.status == 1){
                    this.optionsList = JSON.parse(JSON.stringify(rsp.data.result));
                } else {
                    console.log("获取失败")
                }
            })
            .catch(err=> console.log(err));
        },
         //获取设备名称
        getAddresses(){
            // let obj = {};
            // if(this.restaurantObj.id) {
            //     obj.RestaurantId = this.restaurantObj.id;
            // }
            const url = window.$facilityUrl + `api/Facility/FacilityGetFacilityName?RestaurantId=`+ this.restaurantObj.id;
            axios({method: 'post', url: url})
            .then(rsp=>{
                if(rsp.data.status == 1){
                    this.addressesList = rsp.data.result;
                } else {
                    console.log("获取设备名称失败")
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
        //获取表格数据
        async getTableData(){
            let obj = {};
            if(this.conditionForm.equipmentId !== this.selectDefault) {
                obj.equipmentId =  this.conditionForm.equipmentId;
            }
            if(this.conditionForm.StartTime !== '' && this.conditionForm.StartTime !== null) {
                obj.StartTime =  this.conditionForm.StartTime;
            }
            if(this.conditionForm.EndTime !== '' && this.conditionForm.EndTime !== null) {
                obj.EndTime =  this.conditionForm.EndTime;
            }
            if(this.conditionForm.remark !== '') {
                obj.remark =  this.conditionForm.remark;
            }
            if(this.conditionForm.facilityName !== this.selectDefault) {
                obj.facilityName = this.conditionForm.facilityName;
            }
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            const url = window.$facilityUrl + `api/Facilityrunlog/FacilityrunlogSelectPaging`;
            await axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                } else if(rsp.data.message){
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
        //console.log(`每页 ${val} 条`);
        this.conditionForm.pageSize = val;
        this.conditionForm.pageIndex = 1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.conditionForm.pageIndex = val;
        this.getTableData();
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
                this.getAddresses();
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
.runninglog {
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