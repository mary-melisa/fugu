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
                        min-width="100"
                        prop="cardNumber"
                        label="卡号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="rechargeTime"
                        label="充值时间"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="rechargeAmount"
                        label="充值金额"
                    >
                    </el-table-column>
                    <el-table-column
                        label="充值状态"
                    >
                    <template slot-scope="scope">
                            {{ scope.row.status === 1 ? '成功' : (scope.row.status === 2 ? '失败' : '异常') }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="充值备注"
                    >
                    </el-table-column>
                    <el-table-column
                        width="200px"
                        label="操作"
                    >
                    <template slot-scope="scope" v-if="scope.row.paystatus!=0">
                        <el-button icon="el-icon-coin" @click="handleClick(scope.row)" type="text" size="medium">冲红</el-button>
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
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection', 'setPageSize', 'setPageIndex', 'parentChange'],
    data() {
        return {
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.$emit('setParentSelection', val);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.$emit('setPageSize', val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.$emit('setPageIndex', val);
            this.$emit('parentTableData');
        },
        formateDate(date){
            return moment(date, "YYYY/MM/DD HH:mm:ss").format('YYYY/MM/DD HH:mm:ss')
        },
        // 当前选中数据
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        },
        handleClick(row) {
            this.$emit('parentChange', row);
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
   .total {
       display: inline-flex;
       margin-left: 20px;
       font-size: 20px;
       color: black;
   }
   .pagination {
       display: inline-flex;
       justify-content: center;
   }
</style>