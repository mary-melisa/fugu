<template>
    <div class="redRecord">
        <Breadcrumb :firstMenu="'财务管理'" :secondMenu="'结算管理'"/>
       <div class="search">
            <div class="fieldItem">
                <span class="ml10">选择日期：</span>
                <el-date-picker
                    v-model="startime"
                    class="commonDatePicker"
                    type="datetime"
                    placeholder="开始日期">
                </el-date-picker>
                <span class="ml10 mr10">至</span>
                <el-date-picker
                    v-model="endtime"
                    class="commonDatePicker"
                    type="datetime"
                    placeholder="结束日期">
                </el-date-picker>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="resultObj" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection"/>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/setManagement/components/tableContent/tableContent.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
    },
    data(){
        return{
            startime:'',
            endtime: '',
            resultObj: {},
            currentMeal: {},
            multipleSelection: []
        }
    },
    mounted(){
        this.initDate();
        this.getTableData();
    },
    methods:{
         formateDate(date){
            return moment(date).format('YYYY-MM-DD hh:mm:ss');
        },
        // 初始化日期
        initDate(){
            let timeNow = new Date();// 当前时间
            let weekOfday = moment(timeNow).format('E'); // 计算今天是这周第几天
            let monday = moment(timeNow).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD 00:00:00'); // 周一日期
            this.startime = monday;
            let nextMonday = moment(timeNow).add(8 - weekOfday, 'days').format('YYYY-MM-DD 23:59:59'); // 下周一日期
            this.endtime = nextMonday;
        },
        //获取表格数据
        getTableData(){
            this.$message.closeAll();
            let obj = {};
            if(this.startime) {
                obj.startime = moment(this.startime).format('YYYY-MM-DD HH:mm:ss');
            }else {
                obj.startime = "";
            }
            if(this.endtime) {
                obj.endtime = moment(this.endtime).format('YYYY-MM-DD HH:mm:ss');
            }else{
                obj.endtime = "";
            }
            const url = window.$moneyUrl + `api/settlementmanage/getsettlement?startime=`+ obj.startime + '&endtime=' + obj.endtime;
            axios({method: 'post', url: url})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    // debugger
                    this.resultObj = rsp.data;
                } else{
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
        },
        // 导出
        educe(){
          const url = window.$moneyUrl + `api/settlementmanage/exportsettle`;

          const options = {method: 'post',url: url, responseType: 'blob'};
          console.log(options);
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
                elink.download = "结算管理.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => this.loading.close());
        },
        // 设置当前选中
        selectMeal(rowObj) {
            this.currentMeal = rowObj;
        },
        // 设置复选框选中数据
        setSelection(val) {
            this.multipleSelection = val;
        }
    }
}
</script>

<style lang="scss" scoped>
    .redRecord{
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
        height: calc(100% - 183px);
    }
</style>