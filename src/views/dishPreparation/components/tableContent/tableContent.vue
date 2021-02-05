<template>
    <div class="tableContent">
            <div class="content">
                <el-table
                    ref="multipleTable"
                    :data="parentTableData.result"
                    class="commonTable"
                    tooltip-effect="dark"
                    height="100%"
                    style="width: 100%"
                    @row-click="selectMeal"
                    @selection-change="handleSelectionChange"
                    highlight-current-row
                    stripe
                    border>
                    <el-table-column
                        type="selection"
                        
                        >
                    </el-table-column>
                    <el-table-column
                        label="序号"
                        align="center"
                        >
                        <template slot-scope="scope">
                            {{ scope.$index + (parentDefault.pageIndex - 1) * parentDefault.pageSize + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="restaurantName"
                        label="所属餐厅"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="categoryType"
                        :formatter="getCategory"
                        label="餐别"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="planTime"
                    label="日期"
                    align="center"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                        prop="planName"
                        label="备菜计划"
                        align="center"
                    >
                    </el-table-column> -->
                    <el-table-column
                        prop="Remark"
                        label="备注"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="300px" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="editBtn" icon="el-icon-view" @click="See(scope.row)" >查看详情</el-button>
                            <el-button
                                class="editBtn"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)">
                                编辑
                                </el-button>
                                <el-button
                                class="editBtn"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 查看详情弹窗 -->
                <div >
                    <el-dialog class="commonDialog" width="400px" title="备菜详情" :visible.sync="visible" :close-on-click-modal="false">
                        <el-row>
                            <div class="top">
                                <el-col :span="12"><div class="text">所属餐厅:{{this.restaurantName}}</div></el-col>
                                <el-col :span="12"><div class="text">餐别:{{this.categoryType}}</div></el-col>
                                <el-col :span="12"><div class="text">日期:{{this.planTime}}</div></el-col>
                            </div>
                        </el-row>
                    <el-table class="commonTable" :data="result" label-width="35%">
                        <el-table-column property="name" label="备菜内容" ></el-table-column>
                        <el-table-column property="quantity" label="计划份数" ></el-table-column>
                    </el-table>
                    </el-dialog>
                </div>
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="parentDefault.pageIndex"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="parentDefault.pageSize"
                        :total="parentTableData.toTalCount"
                        layout="total, sizes, prev, pager, next, jumper"
                        >
                    </el-pagination>
                </div>
            </div>
        </div>
</template>

<script>
import moment from 'moment';
import axios from "axios";
export default {
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection', 'currentMeal', 'setPageSize', 'setPageIndex'],
    data() {
        return {
            visible:false,
            currentPage: 1,
            multipleSelection: [],
            getModel:{},
            restaurantName:'',
            categoryType:'',
            planTime:'',
            result:[]
        }
    },
    methods: {
       
         See(data){
             console.log("详情");
             this.categoryType=this.getCategory(data);
             this.planTime=data.planTime;
             this.restaurantName=data.restaurantName;
            this.visible=true;
            const url = window.$config2+`api/DishesPlan/GetDishesPlanById?id=`+data.id;
            axios({ method: 'post', url: url})
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.result = rsp.data.result;
                        console.log(this.result);
                    } else{
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => console.log(err));
      },
        // 菜品类型
        getCategory(val,row){
          if (val.categoryType == 1) return  '早餐'
          if (val.categoryType == 2) return  '中餐'
          if (val.categoryType == 3) return '晚餐'
        },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
         // 编辑
        handleEdit(rowObj) {
            this.$emit('parentEdit', rowObj);
        },
        // 删除
        handleDelete(rowObj) {
             let ids=[];
            ids.push(rowObj.id);
            this.$emit('parentDel', ids);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('setParentSelection',this.multipleSelection);
            let ids=[];
               val.forEach(item => {
                ids.push(item.id);
            });
           
            this.$emit('setSelectIds', ids);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.$emit('setPageSize', val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.$emit('setPageIndex', val);
        },
        // 当前选中菜类
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        }
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep.commonDialog{
        min-height: 700px;  
        .el-dialog{
            min-height: 200px;
            .el-dialog__body{
                min-height: 100px;
                padding:10px 8px;
            }
        }
    }
    .tableContent {
       width: 100%;
       height: 100%;
       .top{
           margin: 10px 0 20px 0;
       }
       .text{
           margin-bottom: 10px;
       }
       .commonTable{
           margin-top: 10px;
       }
       .content {
           padding-top: 40px;
           height: calc(100% - 40px);
       }
   }
</style>
