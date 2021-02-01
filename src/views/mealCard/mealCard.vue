<template>
    <div class="mealCard">
        <Breadcrumb :firstMenu="'财务管理'" :secondMenu="'餐卡管理'"/>
        <el-row class="topsearch">
            <el-col :span="18">
                <el-row>
                    <el-col :span="6">
                    <span style="font-size:16px ">手机号：</span>
                    <el-input placeholder="请输入手机号" v-model="defaultProps.mobile" style="width: 150px;"> </el-input>
                    </el-col>
                    <el-col :span="6">
                    <span style="font-size:16px ">姓名：</span>
                    <el-input placeholder="请输入姓名" v-model="defaultProps.userName" style="width: 150px;"> </el-input>
                    </el-col>
                    <el-col :span="12">
                    <span style="font-size:16px ">办卡时间：</span>
                    <el-date-picker
                        style="border:1px solid #DCDFE6"
                        unlink-panels
                        v-model="createTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6">
              <el-button class="conditionBtn" @click.native="getTableData" >查询</el-button>
              <el-button class="conditionBtn">导出</el-button>
            </el-col>
        </el-row>
        <el-row :span="24" class="operBtns">
            <el-button  icon="el-icon-plus" @click.native="add">充值</el-button>
            <el-button  icon="el-icon-edit"  @click.native="edit">导入充值</el-button>
            <el-button  icon="el-icon-delete" @click.native="del">批量封存</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:setPageSize="setPageSize" v-on:setPageIndex="setPageIndex"/>
        </div>
          <AddMeal v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal"></AddMeal>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/mealCard/components/tableContent/tableContent.vue';
import AddMeal from '@/views/mealCard/components/addMeal/addMeal.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        AddMeal
    },
    data(){
        return{
            urlPrev: 'http://39.106.7.166:8089/',
            defaultProps:{
                mobile:'',
                userName:'',
                createTime:'',
                pageSize: 10,
                pageIndex: 1
            },
            createTime:'',
            result:{}
        }
    },
    mounted(){
        this.getTableData();
    },
    methods:{
        //获取表格数据
        getTableData(){
            console.log("select");
            const url = this.urlPrev+`api/mealcard/getmealcard`;
            axios({method: 'post',url: url,data: this.defaultProps})
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
        },
        // 新增
        add() {
            console.log("add");
          this.dialogVisible = true;
      },
      // 设置页大小
      setPageSize(val) {
          this.defaultProps.pageSize = val;
          this.defaultProps.pageIndex = 1;
          this.getTableData();
      },
      // 设置页码
      setPageIndex(val) {
          this.defaultProps.pageIndex = val;
          this.getTableData();
      }
    }
}
</script>

<style lang="scss" scoped>
    .mealCard{
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
        height: calc(100% - 203px);
    }
</style>