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
                    >
                        <template slot-scope="scope">
                            {{ scope.$index + (parentDefault.pageIndex - 1) * parentDefault.pageSize + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="姓名"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cardNumber"
                        label="卡号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="办卡时间"
                    >
                    <template slot-scope="scope">
                            {{ formateDate(scope.row.createTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="卡内余额"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"
                    >
                    </el-table-column>
                    <el-table-column
                        width="200px"
                        label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="medium">冻结</el-button>
                        <el-button @click="handleEdit(scope.row)" type="text" size="medium">封存</el-button>
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
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection', 'setPageSize', 'setPageIndex'],
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
            console.log(`每页 ${val} 条`);
            this.$emit('setPageSize', val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.$emit('setPageIndex', val);
        },
        formateDate(date){
            return moment(date, "YYYY/MM/DD HH:mm:ss").format('YYYY/MM/DD HH:mm:ss')
        },
        // 当前选中数据
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        },
        handleClick(row) {
        console.log(row);
      }
    }
}
</script>

<style lang="scss" scoped>
   .tableContent {
       width: 100%;
       height: 100%;
       .content {
           height: calc(100% - 40px);
       }
   }
</style>