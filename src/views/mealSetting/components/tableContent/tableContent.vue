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
                        label="餐别编号"
                        >
                        <template slot-scope="scope">
                            {{ scope.$index + (parentDefault.pageIndex - 1) * parentDefault.pageSize + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="mealName"
                        label="餐别名称"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="restaurantName"
                        label="所属食堂"
                    >
                    </el-table-column>
                    <el-table-column
                        label="开餐时间"
                    >
                    <template slot-scope="scope">
                        {{ formateDate(scope.row.startTime ) }}
                    </template>
                    
                    </el-table-column>
                    <el-table-column
                        prop="endTime"
                        label="结束时间"
                    >
                    <template slot-scope="scope">
                        {{ formateDate(scope.row.endTime ) }}
                    </template>
                    </el-table-column>
                     <el-table-column
                        width="200px"
                        label="操作"
                    >
                    <template slot-scope="scope">
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
export default {
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'parentEdit', 'setParentSelection', 'parentDel','parentHandleSizeChange','parentHandleCurrentChange'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: []
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('setParentSelection',this.multipleSelection);
        },
        handleSizeChange(val) {
            //console.log(`每页 ${val} 条`);
            this.$emit('parentHandleSizeChange',val);
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            this.$emit('parentHandleCurrentChange',val);
        },
        formateDate(date){
            return moment(date, "MM/DD/YYYY HH:mm:ss").format('HH:mm:ss')
        },
        // 当前选中餐别
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        },
        // 编辑
        handleEdit(rowObj) {
            this.$emit('parentEdit', rowObj);
        },
        // 删除
        handleDelete(rowObj) {
            this.$emit('parentDel', rowObj);
        }
    }
}
</script>

<style lang="scss" scoped>
   .tableContent {
       width: 100%;
       height: 100%;
       .content {
           padding-top: 20px;
           height: calc(100% - 20px);
       }
   }
</style>