<template>
        <div class="tableContent">
            <div class="content">
                <el-table
                    ref="multipleTable"
                    :key="tableKey"
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
                        label="工号"
                        >
                        <template slot-scope="scope">
                            {{ scope.row.employeeID == 0 ? '' : scope.row.employeeID }}
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
                        min-width="150"
                        prop="idNumber"
                        label="身份证号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="账户余额"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="category"
                        label="会员类型"
                    >
                    </el-table-column>
                    <el-table-column
                        min-width="100"
                        prop="mobile"
                        label="联系电话"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="gender"
                        label="性别"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="人脸入库状态"
                    >
                    </el-table-column>
                    <el-table-column
                        label="人脸照片"
                    >
                        <template slot-scope="scope">
                            <el-image :src="imageUrlPrev + scope.row.facePhotos"  v-if="scope.row.facePhotos"/>     
                            <el-image v-else>
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="300px"
                        label="操作"
                        fixed="right"
                    >
                    <template slot-scope="scope">
                        <el-button
                            class="editBtn"
                            icon="el-icon-camera"
                            @click="changePersonFace(scope.row)">
                            完善人脸
                            </el-button>
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
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection','parentHandleSizeChange','parentHandleCurrentChange','parentEdit','parentDel', 'changeFace'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: [],
            imageUrlPrev: window.$imgUrlPrev,
            tableKey: Math.random()
        }
    },
    methods: {
        changePersonFace(row){
            this.$emit('changeFace', row);
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
        formateDate(date){
            return moment(date, "MM/DD/YYYY HH:mm:ss").format('HH:mm:ss')
        },
        // 当前选中数据
        selectMeal(data) {
            this.$emit('setCurrentMeal', data);
        },
        // 编辑
        handleEdit(rowObj) {
            this.$emit('parentEdit', rowObj);
        },
        // 删除
        handleDelete(rowObj) {
            this.$emit('parentDel', rowObj);
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