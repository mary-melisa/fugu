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
                        label="编号"
                        >
                        <template slot-scope="scope">
                            {{ scope.$index + (parentDefault.pageIndex - 1) * parentDefault.pageSize + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="人员编号"
                        >
                    </el-table-column>
                    <el-table-column
                        label="姓名"
                        >
                        <template slot-scope="scope">
                            {{ scope.row.name ? scope.row.name : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="用户名"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="gender"
                        label="性别"
                        >
                    <template slot-scope="scope">
                            {{ scope.row.gender ==0 ? "女" : "男"}}
                    </template>
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="联系电话"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cardNumber"
                        label="身份证号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="organization"
                        label="组织"
                        >
                        <template slot-scope="scope">{{scope.row.organization[0].name}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="bracelet"
                        label="手环编号"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="role"
                        label="角色"
                    >
                        <template slot-scope="rolescope">{{rolescope.row.role.length>0 ? rolescope.row.role[0].name : ''}}</template>

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
export default {
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection','parentEdit','parentDel','parentHandleSizeChange','parentHandleCurrentChange'],
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
        // 当前选中餐别
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        },
        //编辑
        handleEdit(rowObj){
            this.$emit('parentEdit',rowObj)
        },
        //删除
        handleDelete(rowObj){
            this.$emit('parentDel',rowObj)
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