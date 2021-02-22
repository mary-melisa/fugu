<template>
    <div class="nutrients">
        <Breadcrumb :firstMenu="'基础数据'" :secondMenu="'营养成分'"/>
        <div class="search">
          <div class="fieldItem">
              <span>物料名称：</span>
              <el-input placeholder="请输入物料名称" class="commonInput" v-model="conditionForm.materialName" style="width: 200px;"> </el-input>
          </div>
          <el-button class="conditionBtn" @click="select">查询</el-button>
          <el-button class="conditionBtn" @click="add">添加</el-button> 
        </div>
        <!-- 表格 -->
        <div class="tableContent">
           <el-table
                :data="resultObj.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                stripe
                border
               >
                <el-table-column
                    label="序号">
                     <template slot-scope="scope">
                        {{ scope.$index + (conditionForm.pageIndex - 1) * conditionForm.pageSize + 1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="编号"
                >
                </el-table-column>
                <el-table-column
                    prop="materialName"
                    label="物料名称"
                >
                </el-table-column>
                <el-table-column
                    prop="heat"
                    label="热量(kcal)"
                >
                </el-table-column>
                <el-table-column
                    prop="fat"
                    label="脂肪(g)"
                >
                </el-table-column>
                <el-table-column
                    prop="protein"
                    label="蛋白质(g)"
                >
                </el-table-column>
                <el-table-column
                    prop="carbohydrates"
                    label="碳水化合物(g)"
                >
                </el-table-column>
                 <el-table-column
                    prop="dietaryFiber"
                    label="膳食纤维(g)"
                >
                </el-table-column>
                 <el-table-column
                 label="操作"
                 fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      class="editBtn"
                      icon="el-icon-edit"
                      @click="handleEdit(scope.row)">
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="conditionForm.pageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="conditionForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resultObj.toTalCount">
            </el-pagination>
        </div>
        <AddNutrient v-on:getParentTableData="getTableData" v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:setPageIndexDefault="setPageIndexDefault"></AddNutrient>
        <EditNutrient v-on:getParentTableData="getTableData" v-on:cancelModule="cancelModule" :parentCurrentNutrient="currentNutrient" v-if="editDialogVisible"></EditNutrient>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import AddNutrient from "./components/addNutrient/addNutrient.vue";
import EditNutrient from "./components/editNutrient/editNutrient.vue";
import axios from 'axios'
export default {
    components: {
       Breadcrumb,
       AddNutrient,
       EditNutrient
    },
    data() {
      return {
        urlPrev: 'http://39.106.7.166:8097/',
        resultObj: {},
        conditionForm: {
          materialName: '',
          pageIndex: 1,
          pageSize: 10
        },
        dialogVisible: false,
        editDialogVisible: false,
        currentNutrient: {},
      }
    },
    mounted(){
      this.getTableData();
    },
    methods: {
      // 点击查询按钮
      select(){
        this.conditionForm.pageIndex = 1;
        this.getTableData();
      },
      // 修改
      handleEdit(obj) {
        this.currentNutrient = obj;
        this.editDialogVisible = true;
      },
      // 新增
      add() {
        this.dialogVisible = true;
      },
       // 关闭模态框回调
      cancelModule() {
        this.dialogVisible = false;
        this.editDialogVisible = false;
      },
     // 每页显示条数
     handleSizeChange(val) {
      this.conditionForm.pageSize = val;
      this.conditionForm.pageIndex = 1;
      this.getTableData();
     },
     // 当前页
     handleCurrentChange(val) {
      this.conditionForm.pageIndex = val;
      this.getTableData();
     },
     setPageIndexDefault(val) {
       this.conditionForm.pageIndex = val;
     },
     // 获取表格数据
      getTableData() {
          let obj = {};
          obj.pageIndex = this.conditionForm.pageIndex;
          obj.pageSize = this.conditionForm.pageSize;
          if(this.conditionForm.materialName) {
            obj.materialName = this.conditionForm.materialName;
          }
          const url = this.urlPrev + `api/bddishes/getdishes`;
          axios({ method: 'post', url: url, data: obj })
              .then(rsp => {
                  if (rsp.data.status == 1) {
                    this.resultObj = rsp.data;
                    console.log(this.resultObj);
                  } else{
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                  }
              })
          .catch(err => console.log(err));
      }
    }
};
</script>

<style lang="scss" scoped>
    .nutrients{
      width: 100%;
      height: 100%;
      @include flex();
      flex-direction: column;
      .tableContent {
        width: 100%;
        padding-top: 20px;
        height: calc(100% - 252px);
      }
    }
</style>