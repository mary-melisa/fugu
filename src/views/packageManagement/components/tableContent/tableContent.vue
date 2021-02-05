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
                        prop="setMealName"
                        label="套餐名称"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="categoryName"
                       
                        label="类别"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="price"
                    label="价格（元）"
                    align="center"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                        prop="list"
                        label="套餐内容"
                        align="center"
                    >
                    </el-table-column> -->
                    <el-table-column
                        label="图片"
                        align="center"
                    >
                      <template slot-scope="scope">
                            <el-image :src="scope.row.mealPictures"  v-if="scope.row.mealPictures"/>     
                            <el-image v-else>
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="300px" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="editBtn" icon="el-icon-pie-chart" @click="slectNutrition(scope.row)">营养成分</el-button>
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
import axios from 'axios';
export default {
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection','claId','currentMeal', 'setPageSize', 'setPageIndex', 'setVisible'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: [],
            result:[],

        }
    },
    methods: {
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
        // 营养成分
        slectNutrition(row) {
            this.$emit('setVisible', row);
        },
        // 编辑
        edit() {
            if(Object.keys(this.currentMeal).length) {
                this.title = 2;
                this.dialogVisible = true;
            }else {
                this.$message.closeAll();
                this.$message({
                    message: '请先选择一种菜品',
                    type: 'warn',
                });
            }
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .tableContent {
       width: 100%;
       height: 100%;
       .nutrient{
           margin-bottom: 20px;
       }
       .nutr{
           margin-bottom: 10px;
       }
       .content {
           height: 100%;
       }
   }
</style>