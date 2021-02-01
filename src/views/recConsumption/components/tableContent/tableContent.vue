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
                        prop="orderId"
                        label="订单编号"
                        >
                    </el-table-column>
                    <!-- <el-table-column
                        prop="orderNumber"
                        label="订单流水"
                        >
                    </el-table-column> -->
                    <el-table-column
                        prop="userName"
                        label="姓名"
                    >
                    </el-table-column>
                    <el-table-column
                        min-width="100"
                        prop="className"
                        label="班级"
                    >
                    </el-table-column>
                    <el-table-column
                        min-width="100"
                        prop="accountNumber"
                        label="账号"
                    >
                    </el-table-column>
                    <el-table-column
                        label="支付时间"
                    >
                     <template slot-scope="scope">
                        {{ formateDate(scope.row.orderTime)}}
                    </template>
                    </el-table-column>
                    <el-table-column
                        prop="consumeContent"
                        label="消费内容"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                        prop="orderTime"
                        label="消费时间"
                    >
                    <template slot-scope="scope">
                        {{ formateDate(scope.row.orderTime)}}
                    </template>
                    </el-table-column> -->
                    
                    <el-table-column
                        prop="amount"
                        label="消费金额"
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
                    <div class="total">消费总计： {{ parentTableData.totalAmount }}元</div>
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