<template>
    <div class="matInformation">
        <Breadcrumb :firstMenu="'基础数据'" :secondMenu="'物料信息'"/>
        <div class="search">
          <div class="fieldItem">
            <div class="input">综合查询：<el-input class="commonInput" placeholder="请输入" v-model="keyContent" style="width:200px" clearable> </el-input></div>
          </div>
           <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add">添加物料</el-button>
            <el-button  icon="el-icon-delete" @click="del">批量删除</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentEdit="edit" v-on:parentDel="delSingle" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange"/>
        </div>
        <AddMeal v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" :flag="flag" v-on:setPageIndexDefault="setPageIndexDefault"></AddMeal>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue"
import axios from "axios"
import TableContent from '@/views/matInformation/components/tableContent/tableContent.vue';
import AddMeal from '@/views/matInformation/components/addMeal/addMeal.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        AddMeal
    },
    data(){
        return{
            urlPrev: 'http://39.106.7.166:8097/',
            defaultProps: {
                pageSize: 10,
                pageIndex: 1,
            },
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
            flag: '',  // 'add'代表从营养成分界面跳转过来的
            keyContent: ''
        }
    },
    mounted() {
        this.getTableData();
        this.initData();
    },
    methods:{
        setSelection(arr){
        this.multipleSelection = arr;
      },
      // 查询
      select(){
        this.defaultProps.pageIndex = 1;
        this.getTableData();
      },
      // 初始化数据
        initData(){
          this.flag = this.$route.params.flag;
         if(this.flag === 'add') {
           this.title = 1;
           this.dialogVisible = true;
         }
        },
        setPageIndexDefault(val){
          this.defaultProps.pageIndex = val;
        },
        //获取表格数据
        getTableData(){
            let obj = {};
            obj.pageSize = this.defaultProps.pageSize;
            obj.pageIndex = this.defaultProps.pageIndex;
            if(this.keyContent !== '') {
              obj.keyContent = this.keyContent;
            }
            const url= this.urlPrev+`api/bdmaterial/getmaterial`;
            axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                } else{
                    this.$message( {
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err=> console.log(err));
        },
        handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.defaultProps.pageSize = val;
        this.defaultProps.pageIndex = 1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.defaultProps.pageIndex = val;
        this.getTableData();
      },
      // 新增
      add() {
          this.title = 1;
          this.dialogVisible = true;
      },
      // 编辑
      edit(rowObj) {
         this.title = 2;
         this.currentMeal = rowObj;
         this.dialogVisible = true;
      },
      // 批量删除
      del(){
        if(!this.multipleSelection.length){
          this.$message.closeAll();
          this.$message({
              message: '请先选择一种物料信息',
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
      delSingle(rowObj){
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
        let arr = [];
        if(this.deleteFlag == 'some'){
          this.multipleSelection.forEach(item => {
            arr.push(item.id)
          });
        }else{
          arr.push(rowObj.id)
        }
        const url = this.urlPrev+`api/bdmaterial/delmaterial?ids=`+arr;
        axios({ method: 'post', url: url})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.defaultProps.pageIndex = 1;
                   this.getTableData();
                   this.$message({
                     message: '删除成功！',
                     type: 'success'
                   });
                }else{
                    this.$message({
                      message: rsp.data.message,
                      type: 'error'
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
    }
}
</script>

<style lang="scss" scoped>
.matInformation {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .operBtns {
      border-bottom: 0;
    }
    .model{
       width: 100%;
    }
    .table{
        width: 100%;
        height: calc(100% - 203px);
    }
}
</style>