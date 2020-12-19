<template>
    <div class="canteenTable">
        <div class="tableContent">
            <div v-if="parentTableNo === 1">
                <el-table
                ref="multipleTable"
                :data="parentTableData.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="序号">
                     <template slot-scope="scope">
                        {{ scope.row.id + (parentPageIndex - 1) * parentPageSize }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="restaurantName"
                    label="名称"
                >
                </el-table-column>
                <el-table-column
                    prop="parentName"
                    label="所属上级"
                >
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="联系人"
                >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="联系方式"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址"
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                >
                </el-table-column>
                </el-table>
            </div>
            <div v-else-if="parentTableNo === 2">
                <el-table
                ref="multipleTable"
                :data="parentTableData.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="食堂编号">
                <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="食堂名称">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="就餐人数"
                >
                </el-table-column>
                <el-table-column
                    prop="业务模式"
                    label="所属上级"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="负责人"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="联系电话"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="食堂照片"
                >
                </el-table-column>
            </el-table>
            </div>
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
    props: [ 'parentTableData', 'parentTableNo', 'parentPageIndex', 'parentPageSize' ],
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
        height: calc(100% - 68px);
        div {
            width: 100%;
            height: 100%;
        }
    }
}
</style>