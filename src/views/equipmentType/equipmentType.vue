<template>
    <div class="equipmentType">
        <Breadcrumb :firstMenu="'设备管理'" :secondMenu="'设备类型'"/>
        <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add">添加</el-button>
            <el-button  icon="el-icon-delete" @click="del">批量删除</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentEdit="edit" v-on:parentDel="delSingle" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange"/>
        </div>
        <AddMeal v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" v-on:setPageIndexDefault="setPageIndexDefault"></AddMeal>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue"
import axios from "axios"
import TableContent from '@/views/equipmentType/components/tableContent/tableContent.vue';
import AddMeal from '@/views/equipmentType/components/addMeal/addMeal.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        AddMeal
    },
    data(){
        return{
            urlPrev: window.$facilityUrl,
            currentPage: 1,
            defaultProps: {
                pageSize: 10,
                pageIndex: 1,
            },
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中设备类型
            title: 1, // 1 新增设备类型  2编辑设备类型
            deleteFlag: 'some' // 'some'批量删除   'single' 单个删除
        }
    },
    mounted() {
        this.getTableData();
    },
    methods:{
        setSelection(arr){
        this.multipleSelection = arr;
        console.log(arr)
      },
      setPageIndexDefault(val) {
        this.defaultProps.pageIndex = val;
      },
        //获取表格数据
        getTableData(){
            const url= window.$facilityUrl + `api/FaciliType/getequitype`;
            axios({method: 'post', url: url, data: this.defaultProps})
            .then(rsp=>{
                if(rsp.data.status==1){
                    console.log(rsp)
                    
                    // 去掉类型名称收尾空格
                   if(rsp.data && rsp.data.result && rsp.data.result.length) {
                     let arr = rsp.data.result;
                     arr.forEach(item => {
                       if(item.equimentTypeName) {
                         item.equimentTypeName = (item.equimentTypeName).trim();
                       }
                     })
                     this.result = rsp.data;
                     this.result.result = arr;
                     console.log(this.result)
                   }
                } else {
                    console.log("获取失败")
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
      //编辑
      edit(rowObj){
        this.title=2;
        this.currentMeal = rowObj;
        this.dialogVisible = true;
      },
      // 批量删除
      del(){
        if(!this.multipleSelection.length){
          this.$message({
              message: '请先选择一种设备类型',
              type: 'warn',
          });
        }else {
          this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.deleteFlag = 'some';
              this.deleteMeal({});
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
        this.$message.closeAll();
        let arr = [];
        if(this.deleteFlag == 'some'){
          this.multipleSelection.forEach(item => {
            arr.push(item.id)
          });
        }else{
          arr.push(rowObj.id)
        }
        const url = this.urlPrev+`api/FaciliType/delequitype?ids=`+arr;
        axios({ method: 'post', url: url})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.defaultProps.pageIndex = 1;
                   this.getTableData();
                    this.$message({
                        message: '删除成功！',
                        type: 'success',
                    });
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
  .equipmentType{
        width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .model{
       width: 100%;
    }
    .table{
        width: 100%;
        height: calc(100% - 203px);
    }
  }
</style>