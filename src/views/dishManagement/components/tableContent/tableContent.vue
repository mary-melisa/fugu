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
                        prop="dishesName"
                        label="菜品名称"
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
                    <el-table-column
                        prop="netContent"
                        label="菜品净含量(g)"
                        align="center"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                        prop="dishesList"
                        label="主料信息"
                        align="center"
                    >
                    </el-table-column> -->
                    <el-table-column
                        label="图片"
                        align="center"
                    >
                     <template slot-scope="scope">
                       <el-image :src="scope.row.dishesPictures"  v-if="scope.row.dishesPictures"/>     
                       <el-image v-else>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="250px" fixed="right">
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
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection','claId','currentMeal','parentSetPageSize', 'parentClass'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: []
        }
    },
    methods: {
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
         // 编辑
        handleEdit(rowObj) {
            this.$emit('parentEdit', rowObj);
        },
        // 删除
        handleDelete(rowObj) {
            this.$emit('setCurrentMeal', rowObj);
            this.$emit('parentDel', rowObj);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('setParentSelection',this.multipleSelection);
        },
        handleSizeChange(val) {
            this.$emit('parentSetPageSize', val);
        },
        handleCurrentChange(val) {
            this.$emit('parentSetPageIndex', val);
        },
        // 当前选中菜类
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
           height: 100%;
       }
   }
</style>
