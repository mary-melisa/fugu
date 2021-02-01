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
                        prop="userName"
                        label="姓名"
                        >
                    </el-table-column>
                     <el-table-column
                        prop="categoryName"
                        label="类型"
                        >
                    </el-table-column>
                     <el-table-column
                        prop="cardNumber"
                        label="卡号"
                        >
                    </el-table-column>
                    <!-- <el-table-column
                        label="卡号"
                        >
                        <template slot-scope="scope">
                            {{ scope.row.FacilityName ? scope.row.FacilityName : '' }}
                        </template>
                    </el-table-column>
                    -->
                    <!-- <el-table-column
                        prop="Ip"
                        label="IP地址"
                        >
                    </el-table-column> -->
                    <el-table-column
                        prop="amount"
                        label="账户余额"
                        >
                    </el-table-column>
                    
                     <el-table-column
                        label="状态"
                        >
                         <template slot-scope="scope">
                            {{ scope.row.status === 1 ? '已激活' : (scope.row.status === 0 ? '已挂失' : '已注销') }}
                        </template>
                    </el-table-column>
                    
                    <!-- <el-table-column
                        min-width="410px"
                        label="操作"
                    >
                    <template slot-scope="scope">
                         <el-button
                            class="editBtn"
                            icon="el-icon-setting"
                            v-if="scope.row.status == 1"
                            @click="setPassword(scope.row)">
                            重置密码
                            </el-button>
                            <el-button
                            class="editBtn"
                            icon="el-icon-crop"
                             v-if="scope.row.status != 2"
                            @click="onChangeStatus(scope.row, 2)">
                            注销
                            </el-button>
                             <el-button
                            class="editBtn"
                            icon="el-icon-delete"
                            v-if="scope.row.status != 2"
                            @click="onChangeStatus(scope.row, 1)">
                            激活
                            </el-button>
                             <el-button
                            class="editBtn"
                            icon="el-icon-lock"
                            v-if="scope.row.status == 1"
                            @click="onChangeStatus(scope.row, 0)">
                            挂失
                            </el-button>
                    </template>
                    </el-table-column> -->
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
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection', 'parentHandleSizeChange','parentHandleCurrentChange', 'parentOptionsList', 'parentChangeStatus'],
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
        },
        //重置密码
        setPassword(rowObj){
            // this.$emit('parentEdit',rowObj)
        },
        // 退卡、激活、挂失
        onChangeStatus(rowObj, status) {
            let obj = {};
            obj.id = rowObj.Id;
            obj.status = status;
            this.$emit('parentChangeStatus', obj);
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