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
                    stripe
                    border
                    highlight-current-row>
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
                        prop="EquipmentName"
                        label="设备类型"
                        >
                         <!-- <template slot-scope="scope">
                            {{ formatStatus(scope.row.EquipmentId) }}
                        </template> -->
                    </el-table-column>

                    <el-table-column
                        label="设备名称"
                        >
                        <template slot-scope="scope">
                            {{ scope.row.FacilityName ? scope.row.FacilityName : '' }}
                        </template>
                    </el-table-column>
                    
                    <!-- <el-table-column
                        prop="Ip"
                        label="IP地址"
                        >
                    </el-table-column> -->
                    <el-table-column
                        prop="FacilityAddress"
                        label="设备地址"
                        >
                    </el-table-column>
                     <el-table-column
                        prop="CreateTime"
                        label="运行时间"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="Remark"
                        label="日志内容"
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
export default {
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection','parentHandleSizeChange','parentHandleCurrentChange', 'parentOptionsList'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: [],
            imageUrlPrev: window.$imgUrlPrev,
        }
    },
    methods: {
        formatStatus(value) {
            let obj = this.parentOptionsList.find(item => item.id === value);
            if(obj && Object.keys(obj).length) {
                return obj.equipmentName;
            }
            return "";
        },
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
        // 当前选中餐别
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        }
    }
}
</script>

<style lang="scss" scoped>
   .tableContent {
       width: 100%;
       height: 100%;
       .content {
           padding-top: 0px;
           height: calc(100% - 40px);
       }
   }
</style>