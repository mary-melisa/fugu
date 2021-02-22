<template>
    <div class="redRecord">
        <Breadcrumb :firstMenu="'财务管理'" :secondMenu="'冲红记录'"/>
       <div class="search">
            <div class="fieldItem">
                <span class="ml10">冲红时间：</span>
                <el-date-picker
                    v-model="startTime"
                    class="commonDatePicker"
                    type="datetime"
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
              <el-input placeholder="请输入姓名/班级/卡号" class="commonInput" v-model="keyContent" style="width: 300px;"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="resultObj" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:setPageSize="setPageSize" v-on:setPageIndex="setPageIndex"/>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/redRecord/components/tableContent/tableContent.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
    },
    data(){
        return{
            urlPrev: 'http://39.106.7.166:8089/',
            keyContent:'',
            defaultProps:{
                pageSize: 10,
                pageIndex: 1
            },
            startTime: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
            endTime: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
            resultObj: {},
            currentMeal: {},
            multipleSelection: [],
            loading:null,
            firstLoad: true,    // 第一次加载
        }
    },
    mounted(){
        this.getTableData();
    },
    methods:{
        select(){
            this.defaultProps.pageIndex = 1;
            this.getTableData();
        },
        //获取表格数据
        getTableData(){
            let obj = {};
            obj.pageSize = this.defaultProps.pageSize;
            obj.pageIndex = this.defaultProps.pageIndex;
            // 解决查询条件双向绑定问题，没点击查询的时候不传查询条件
            if(this.keyContent) {
                obj.keyContent = this.keyContent;
            }
            if(this.startTime) {
                obj.startTime = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if(this.endTime) {
                obj.endTime = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss');
            }
            // 第一次加载页面需要传默认的时间条件
            if(this.firstLoad) {
                if(this.startTime) {
                    obj.startTime = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss');
                }
                if(this.endTime) {
                    obj.endTime = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss');
                }
            }
            const url = window.$moneyUrl + `api/rushred/getrushredinfo`;
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                this.loading.close();
                this.firstLoad = false;
                if (rsp.data.status == 1) {
                    this.resultObj = rsp.data;
                } else{
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
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
        // 设置选中当前选中冲红记录
        selectMeal(rowObj) {
            this.currentMeal = rowObj;
        },
        // 设置选中复选框记录
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