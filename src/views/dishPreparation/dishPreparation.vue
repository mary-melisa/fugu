<template>
    <!-- <h3>备菜计划</h3> -->
    <div class="dishManagement">
        <Breadcrumb :firstMenu="'备餐管理'" :secondMenu="'备菜计划'" />
        <div class="search">
            <div class="fieldItem">
                <span>选择日期：</span>
                <el-date-picker
                    class="commonDatePicker"
                    v-model="defaultProps.startTime"
                    type="date"
                    placeholder="备菜计划开始时间">
                </el-date-picker>
                <span class="ml10 mr10">至</span>
                <el-date-picker
                    class="commonDatePicker"
                    v-model="defaultProps.endTime"
                    type="date"
                    placeholder="备菜计划结束时间">
                </el-date-picker>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button>
        </div>
        <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()"> 添加</el-button>
            <el-button  icon="el-icon-delete" @click="del()">批量删除</el-button>
        </el-row>
        <div class="table">
            <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentEdit="edit" v-on:parentDel="setIds" v-on:setSelectIds="setSelectIds" v-on:setPageSize="setPageSize" v-on:setPageIndex="setPageIndex"/>
        </div>
        <AddPrepareFood v-on:getTableData="getTableData" v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal"></AddPrepareFood>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/dishPreparation/components/tableContent/tableContent.vue';
import AddPrepareFood from '@/views/dishPreparation/components/addPrepareFood/addPrepareFood.vue';
import moment from 'moment';

export default {
    components:{
        Breadcrumb,
        AddPrepareFood,
        TableContent
    },
    data() {
        return {
            urlPrev: window.$config2,
            urlMater: window.$config1,
            Ids:[],
            result: {},
            defaultProps: {
                pageSize: 10,
                pageIndex: 1,
                startTime: '',
                endTime: ''
            },
            currentMeal: {},     // 当前选中计划
            dialogVisible: false,
            title: 1 ,          // 1 新增计划  2编辑计划
            multipleSelection: [],
            loaindg:null
        }
    },
    mounted(){
        this.getTableData();
    },
    methods:{
        //获取住页面表格数据
        getTableData(){
            const url = this.urlPrev+`api/DishesPlan/GetDishesPlanPageList`;
            const obj = {};
            obj.pageSize = this.defaultProps.pageSize;
            obj.pageIndex = this.defaultProps.pageIndex;
            Object.keys(this.defaultProps).forEach(key => {
                if(this.defaultProps[key]) {
                    if(key === 'startTime' || key === 'endTime') {
                        obj[key] = moment(this.defaultProps[key]).format('YYYY-MM-DD');
                    }
                }
            });
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios({ method: 'post', url: url, data: obj })
                .then(rsp => {
                    this.loading.close();
                    if (rsp.data.status == 1) {
                        this.result = rsp.data;
                    } else{
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => 
                this.loading.close()
            );
        },
        setIds(rowObj){
            this.Ids=rowObj;
            this.del();
        },
        setSelectIds(rowObj){
            this.Ids=rowObj;
        },
        // 导出
        educe(){
          let arr = [];
          const url = window.$config2 + `api/DishesPlan/ExportDishesPlan`;

          if(this.multipleSelection.length) {
              this.multipleSelection.forEach(item => {
                  arr.push(item.id);
              })
          }
          const options = {method: 'post',url: url, responseType: 'blob', data: arr};
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
                elink.download = "备菜计划.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            }).catch(err => 
                this.loading.close()
            );
        },
        // 设置页显示条数
        setPageSize(val) {
            this.defaultProps.pageSize = val;
            this.getTableData();
        },
        // 设置页码
        setPageIndex(val) {
            this.defaultProps.pageIndex = val;
            this.getTableData();
        },
        //新增
        add(){
            this.title = 1;
            this.dialogVisible = true;
        },
        //批量删除
        del(){
            if (!this.Ids.length) {
               this.$message.closeAll();
               this.$message({
                message: '请选择数据',
                type: 'warn',
              });
            }
            this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
        const url = window.$config2+`api/DishesPlan/DishesPlanDelete`;
        axios({ method: 'post', url: url,data:this.Ids})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                        this.getTableData();
                }else if(rsp.data.status == 0){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
           
            
          })
        },
        // 当前选中计划
        selectMeal(meal){
            this.currentMeal = meal;
            console.log(meal);
        },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)  
        },
        // 关闭模态框回调
        cancelModule(val) {
            this.dialogVisible = val;
        },
        // 编辑
        edit(rowObj) {
            this.title = 2;
            this.currentMeal = rowObj;
            this.dialogVisible = true;
        },
        
    }
}
</script>

<style lang='scss' scoped>
.dishManagement{
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    // .search{
    //     min-width: 100%;
    //     margin-top: 20px;
    // }
    .operBtns{
        margin-left: 20px;
    }
    .table{
        width: 100%;
        height: calc(100% - 203px);
    }
}
.operBtns[data-v-b7843afe]{
    padding: 10px 0px 0px 0px;
    margin-bottom: -35px;
    border-bottom: none;
}
</style>