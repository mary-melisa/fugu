<template>
    <div class="canteenTable">
        <div class="tableContent">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        class="commonTable"
                        tooltip-effect="dark"
                        height="100%"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <!-- <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column> -->
                        <el-table-column
                            label="食堂编号">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="materiaName"
                            label="物料名称">
                        </el-table-column>
                        <el-table-column
                            prop="Heat"
                            label="热量(kcal)"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="Fat"
                            label="脂肪(g)">
                        </el-table-column>
                        <el-table-column
                            prop="Protein"
                            label="蛋白质(g)"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="Carbohydrates"
                            label="碳水化合物(g)"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="DietaryFiber"
                            label="膳食纤维(g)"
                        >
                        </el-table-column>
                        <el-table-column
                            label="操作"
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
                :total="parentTableData.toTalCount">
            </el-pagination>
            
        </div>
    </div>
</template>
<script>
export default {
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
        }
    }
}
</script>
<style lang="scss" scoped>
.canteenTable {
    width: 100%;
    height: 100%;
    .tableContent {
        width: 100%;
        height: calc(100% - 75px);
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