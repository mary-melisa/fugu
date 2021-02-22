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
                        prop="className"
                        label="班级"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cardNumber"
                        width="180px"
                        label="卡号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="rushRedTime"
                        label="冲红操作时间"
                    >
                    <template slot-scope="scope">
                            {{ formateDate(scope.row.rushRedTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="rushRedAmount"
                        label="冲红金额(元)"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="rushRedType"
                        label="冲红类型"
                    >
                    <template slot-scope="scope">
                        {{ scope.row.rushRedType==1? "消费冲红": "充值冲红"}}
                    </template>
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="冲红状态"
                    >
                    <template slot-scope="scope">
                        {{ scope.row.status==1? "冲红成功": "冲红失败"}}
                    </template>
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="冲红备注"
                    >
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
            return moment(date, "MM/DD/YYYY HH:mm:ss").format('YYYY/MM/DD HH:mm:ss')
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