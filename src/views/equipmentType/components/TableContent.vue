<template>
    <div class="canteenTable">
                <div class="tableContent">
                    <el-table
                        ref="multipleTable"
                        :data="parentTableData.result"
                        class="commonTable"
                        tooltip-effect="dark"
                        height="100%"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            >
                        </el-table-column>
                        <el-table-column
                            label="类型编号"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="equipmentName"
                            label="类型名称"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            label="备注"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props:['parentTableData'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: []
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        getTableData(){

        }
    }
}
</script>

<style lang="scss" scoped>
    .canteenTable {
    margin-top:20px;
    width: 100%;
    height: 100%;
    .tableContent {
        width: 100%;
        height: calc(100% - 278px);
        div {
            width: 100%;
            height: 100%;
        }
    }
    .pagination {
        width: 100%;
        height: 60px;
        .el-pagination {
            padding-top: 16px;
        }
        position:fixed; 
        bottom:40px; 
        margin-left:30%;
    }
}
</style>