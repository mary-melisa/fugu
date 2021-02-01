<!-- 餐卡维护 -->
<template>
    <div class="cardMaintenance">
        <Breadcrumb :firstMenu="'卡务管理'" :secondMenu="'餐卡维护'"/>
        <div class="search">
             <div class="fieldItem">
                <span>餐卡类型:</span>
                <el-select class="commonSelect ml15"  v-model="conditionForm.categoryId" placeholder="请选择">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option
                    v-for="item in optionsList"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id">
                    </el-option>
                </el-select>
             </div>
            <div class="fieldItem">
                <span>姓名：</span>
                <el-input placeholder="请输入姓名" class="commonInput" v-model="conditionForm.userName" style="width: 200px;"> </el-input>
            </div>
            <div class="fieldItem">
                <span>卡号：</span>
                <el-input placeholder="请输入卡号" class="commonInput" v-model="conditionForm.cardNumber" style="width: 200px;"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange" :parentOptionsList="optionsList" v-on:parentChangeStatus="changeStatus"/>
        </div>
        <SetPassword v-if="passwordDialog" v-on:cancelModule="cancelModule" v-on:getTableData="getTableData" :currentMeal="currentMeal" v-on:setPassword="setPassword"></SetPassword>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/cardMaintenance/components/tableContent/tableContent.vue';
import SetPassword from '@/views/cardMaintenance/components/setPassword/setPassword.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        SetPassword
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
                userName: '',
                cardNumber: '',
                categoryId: this.selectDefault
            },
            addMeal:{
                name:'',
                mobile:'',

            },
            optionsList: [],  // 餐卡类型列表
            addressesList: [], // 设备地址和设备名称列表
            dialogFormVisible:false,
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
            passwordDialog: false
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
        // 获取设备类型
        this.getEquitypes();
        // 获取分页表格信息
         this.getTableData();
    },
    methods:{
        // 重置密码
        setPassword(rowObj) {
            this.currentMeal = rowObj;
            this.passwordDialog = true;
        },
        // 导出
        educe(){
            let arr = [];
            if(this.multipleSelection.length) {
                this.multipleSelection.forEach(item => {
                    arr.push(item.Id);
                })
            }
            let obj = {};
            obj.listCardId = arr;
          const url = window.$cardUrl + `api/Card/Excel`;
          axios({method: 'post',url: url, responseType: 'blob', data: obj})
            .then(rsp=>{
                let elink = document.createElement('a');
                elink.download = "餐卡维护.xls";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => console.log(err));
        },
        //获取餐卡类型
        getEquitypes(){
            const url = window.$cardUrl + `api/CardCategory/CardCategoryGetAll`;
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
        handleSizeChange(val) {
            //console.log(`每页 ${val} 条`);
            this.conditionForm.pageSize = val;
            this.conditionForm.pageIndex = 1;
            this.getTableData();
        },
       // 初始化用户信息
       initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          this.restaurantObj = this.cateenInfo;
          this.conditionForm.restaurantId = this.restaurantObj.id;
       },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
        // 激活、挂失、退卡
        changeStatus(obj) {
            const url = window.$cardUrl + `api/Card/RefundCard`;
            axios({method: 'post',url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.$message.closeAll();
                    let msg = "";
                    if(status === 1) {
                        msg = '激活成功！';
                    }else if(status === 2) {
                        msg = "注销成功！";
                    }else if(status === 0) {
                        msg = "挂失成功！";
                    }
                     this.$message({
                        message: msg,
                        type: 'success',
                    });
                    this.getTableData();
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
        //获取表格数据
        getTableData(){
            let obj = {};
            if(this.conditionForm.categoryId !== this.selectDefault) {
                obj.categoryId =  this.conditionForm.categoryId;
            }
            if(this.conditionForm.userName !== '') {
                obj.userName =  this.conditionForm.userName;
            }
            if(this.conditionForm.cardNumber !== '') {
                obj.cardNumber =  this.conditionForm.cardNumber;
            }
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            const url = window.$cardUrl + `api/Card/CardGetAll`;
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
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
      handleCurrentChange(val) {
        this.conditionForm.pageIndex = val;
        this.getTableData();
      },
      // 关闭模态框回调
      cancelModule() {
          this.passwordDialog = false;
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
.cardMaintenance {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .model{
       width: 100%;
    }
    .table{
        width: 100%;
        padding-top: 20px;
        height: calc(100% - 183px);
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