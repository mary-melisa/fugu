<template>
    <div class="mealSetting">
        <Breadcrumb :firstMenu="'基础数据'" :secondMenu="'餐别设置'" />
         <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加</el-button>
            <el-button  icon="el-icon-edit"  @click="edit()">编辑</el-button>
            <el-button  icon="el-icon-delete" @click="del()">删除</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal"/>
        </div>
         <AddMeal v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal"></AddMeal>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/mealSetting/components/tableContent/tableContent.vue';
import AddMeal from '@/views/mealSetting/components/addMeal/addMeal.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        AddMeal
    },
    data() {
        return {
            urlPrev: 'http://webapi.free.idcfengye.com/',
            defaultProps: {
                pageSize: 10,
                pageIndex: 1,
                restaurantId: "1"
            },
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中餐别
            titile: 1 // 1 新增餐别  2编辑餐别
        };
    },
    mounted() {
        this.getTableData();
    },
     methods: {
      // handleNodeClick(data) {
      //     debugger
      //   console.log(data);
      // },
      // toggleSelection(rows) {
      //   if (rows) {
      //     rows.forEach(row => {
      //       this.$refs.multipleTable.toggleRowSelection(row);
      //     });
      //   } else {
      //     this.$refs.multipleTable.clearSelection();
      //   }
      // },
      //获取表格数据
      getTableData() {
            const url = this.urlPrev+`api/bdmealinfo/getmeal`;
            axios({ method: 'post', url: url, data: this.defaultProps})
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        console.log(rsp);
                        this.result = rsp.data;
                    } else {
                        console.log('获取失败！');
                        this.$alert('发送请求获取失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
      //添加表格数据
      
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      // 新增
      add() {
          this.title = 1;
          this.dialogVisible = true;
      },
      // 编辑
      edit() {
        if(Object.keys(this.currentMeal).length) {
          this.title = 2;
          this.dialogVisible = true;
        }else {
           this.$alert('请先选择一种餐别', '提示', {
              confirmButton: '确定',
              type: 'warn',
          });
        }
      },
      // 删除餐别设置
      del(){

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
.mealSetting {
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