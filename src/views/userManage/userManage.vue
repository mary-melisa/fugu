<template>
    <div class="memManagement">
        <Breadcrumb :firstMenu="'系统管理'" :secondMenu="'角色管理'"/>
        <div class="search">
            <div class="fieldItem">
                <span>关键字：</span>
                <el-input placeholder="请输入关键字" v-model="defaultProps.name" class="commonInput"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <div class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加</el-button>
            <el-button  icon="el-icon-delete" @click="del()">批量删除</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:parentEdit="edit" v-on:parentDel="del" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange"/>
        </div>
        <AddUser v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" v-on:setPageIndexDefault="setPageIndexDefault"></AddUser>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/userManage/components/tableContent/tableContent.vue';
import AddUser from '@/views/userManage/components/addUser/addUser.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        AddUser
    },
    data(){
        return{
            defaultProps:{
                pageSize: 10,
                pageIndex: 1,
                name:'',
            },
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some' // 'some'批量删除   'single' 单个删除
        }
    },
    mounted(){
        this.getTableData();
    },
    methods:{
        setSelection(arr){
        this.multipleSelection = arr;
        console.log(arr)
      },
      setPageIndexDefault(val){
        this.defaultProps.pageIndex = val;
      },
      select(){
        // 查询
        this.defaultProps.pageIndex = 1;
        this.getTableData();
      },
        //获取表格数据
        getTableData(){
            let obj = {};
            obj.pageIndex = this.defaultProps.pageIndex;
            obj.pageSize = this.defaultProps.pageSize;
            if(this.defaultProps.name) {
              obj.name = this.defaultProps.name;
            }
            const url = window.$config+`api/Roles/GetRolePageList`;
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                } else{
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
      //编辑
      edit(rowObj) {
         this.title = 2;
         this.currentMeal = rowObj;
         this.dialogVisible = true;
      },
      // 批量删除
      del(){
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
      //单个删除
      del(rowObj){
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
        if(this.deleteFlag === 'some') {
          this.multipleSelection.forEach(item => {
            arr.push(item.id)
          });
        }else {
          arr.push(rowObj.id);
        }
        const url = this.urlPrev+`api/member/delmember?ids=`+arr;
        axios({ method: 'post', url: url})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.getTableData();
                }else if(rsp.data.status == 0){
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
    }
    
}
</script>

<style lang="scss" scoped>
    .memManagement{
        width: 100%;
        height: 100%;
        @include flex();
        flex-direction: column;
        .model{
        width: 100%;
        }
    }
    .searchinput{
        display: flex;
        text-align:justify;
        justify-content:space-between
    }
    .allinput{
        display: flex;
    }
    .input{
        font-size: 16px;
        margin-right: 10px;
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
        height: calc(100% - 203px);
    }
</style>