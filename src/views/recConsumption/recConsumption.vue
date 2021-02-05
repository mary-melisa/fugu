<template>
    <div class="recConsumption">
        <Breadcrumb :firstMenu="'财务管理'" :secondMenu="'消费流水'"/>
        <div class="search">
            <!-- <div class="fieldItem">
              <span>用户账号：</span>
              <el-input placeholder="请输入用户账号" class="commonInput" v-model="accountNumber" style="width: 200px;"> </el-input>
            </div> -->
            
            <div class="fieldItem">
              <span class="ml10">消费时间：</span>
             <el-date-picker
                type="datetime"
                v-model="startTime"
                class="commonDatePicker"
                placeholder="开始日期">
            </el-date-picker>
            <span class="ml10 mr10">至</span>
            <el-date-picker
                v-model="endTime"
                class="commonDatePicker"
                type="datetime"
                placeholder="结束日期">
            </el-date-picker>
            </div>
            <div class="fieldItem">
              <!-- <span class="ml10">姓名：</span> -->
              <el-input placeholder="请输入订单编号/姓名/账号" class="commonInput" v-model="keyContent" style="width: 300px;"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:setPageSize="setPageSize" v-on:setPageIndex="setPageIndex" v-on:parentChange="change"/>
        </div>
        <Gored v-if="dialogVisible" v-on:cancelModule="closeDialog" v-on:consumerushred="consumerushred"/>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/recConsumption/components/tableContent/tableContent.vue';
import Gored from "./components/gored/gored.vue";
import moment from 'moment';
export default {
    components:{
        Breadcrumb,
        TableContent,
        Gored
    },
    data(){
        return{
            urlPrev: 'http://39.106.7.166:8089/',
            defaultProps:{
                pageSize: 10,
                pageIndex: 1
            },
            keyContent:'',
            // userName:'',
            startTime: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
            endTime: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
            result:{},
            currentMeal: {}, // 当前流水
            restaurantObj: {}, // 当前食堂
            dialogVisible: false,
            userInfo: {}, // 用户信息
            multipleSelection: [],
            loading:false,
        }
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted(){
        // 初始化用户信息
        this.init();
    },
    methods:{
        async init(){
            await this.initUserInfo();
            this.getTableData();
        },
         // 初始化用户信息
        initUserInfo(){
            this.restaurantObj = this.cateenInfo;
            const user = localStorage.getItem("userInfo"); 
            if(user) {
                this.userInfo = JSON.parse(user);
            }
        },
        //获取表格数据
        getTableData(){
            let obj = {};
            obj.pageSize = this.defaultProps.pageSize;
            obj.pageIndex = this.defaultProps.pageIndex;
            if(this.keyContent) {
                obj.keyContent = this.keyContent;
            }
            // if(this.accountNumber) {
            //     obj.accountNumber = this.accountNumber;
            // }
            if(this.startTime) {
                obj.startTime = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if(this.endTime) {
                obj.endTime = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if(this.restaurantObj.id) {
                obj.restaurantId = this.restaurantObj.id;
            }
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            const url = window.$moneyUrl + `api/consume/getconsume`;
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                this.loading.close();
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                    // if(rsp.data.result && rsp.data.result.length) {
                    //     rsp.data.result.forEach(item => {
                    //         this.totalPrice += Number(item.amount);
                    //     });
                    // }
                } else if(rsp.data.message){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            }).catch((err)=>{
                this.loading.close();
            })
        },
        // 导出
        educe(){
          let arr = [];
          let str = "";
          let url = window.$moneyUrl + `api/consume/exportconsume`;
          if(this.multipleSelection.length) {
            this.multipleSelection.forEach(item => {
              arr.push(item.id);
              })
            str = arr.join(',');
            url = window.$moneyUrl + `api/consume/exportconsume?ids=` + str;
          }
          const  options = {method: 'post',url: url, responseType: 'blob' };
          this.loading = this.$loading({
                lock: true,
                text: '导出中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
          });
          axios(options)
            .then(rsp=>{
                this.loading.close();
                let elink = document.createElement('a');
                elink.download = "消费流水.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => this.loading.close());
        },
        // 设置当前流水
        selectMeal(rowObj) {
            this.currentMeal = rowObj;
        },
        // 选择流水
        setSelection(val){
            this.multipleSelection = val;
        },
        // 改变分页条数
        setPageSize(val) {
            this.defaultProps.pageSize = val;
            this.defaultProps.pageIndex = 1;
            this.getTableData();
        },
        // 改变分页页面
        setPageIndex(val) {
            this.defaultProps.pageIndex = val;
            this.getTableData();
        },
        // 冲红
        change(rowObj) {
            this.currentMeal = rowObj;
            this.dialogVisible = true;
        },
        // 关闭弹窗
        closeDialog(){
            this.dialogVisible = false;
        },
        // 冲红
        consumerushred(amount){
            let obj = {};
            obj.userId = this.currentMeal.userId;
            obj.accountNumber = this.currentMeal.accountNumber;
            if(amount) {
                obj.amount = amount;
            }else {
                this.$message.closeAll();
                this.$message({
                    message: '请输入冲红金额',
                    type: 'warn'
                });
                return false;
            }
            const url = window.$moneyUrl + `api/consume/consumerushred`;
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.$message({
                        message: '冲红成功',
                        type: 'success'
                    });
                    this.getTableData();
                    this.closeDialog();
                } else{
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
        }
    },
    watch: {
        cateenInfo: {
            handler(newValue){
                this.restaurantObj = newValue;
                this.getTableData();
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
    .recConsumption{
        width: 100%;
        height: 100%;
        @include flex();
        flex-direction: column;
        .model{
        width: 100%;
        }
    }
    .operBtns{
        border-bottom: 0;
        border-top: 1px solid #cccccc;
    }
    .topsearch{
        margin-bottom: 20px;
    }
    .table{
        width: 100%;
        margin-top: 20px;
        height: calc(100% - 223px);
    }
</style>