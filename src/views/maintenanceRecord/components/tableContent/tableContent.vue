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
                            {{ scope.$index + (parentDefault.PageIndex - 1) * parentDefault.PageSize + 1 }}
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                        label="设备名称"
                        >
                        <template slot-scope="scope">
                            {{ scope.row.FacilityName ? scope.row.FacilityName : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="equimentTypeName"
                        label="设备类型"
                        >
                         <!-- <template slot-scope="scope">
                            {{ formatStatus(scope.row.EquipmentId) }}
                        </template> -->
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
                        prop="UserName"
                        label="负责人"
                        >
                    </el-table-column>
                     <el-table-column
                        label="保养时间"
                        >
                         <template slot-scope="scope">
                            {{ formatDate_date(scope.row.CreateTime) }}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        label="设备状态"
                        >
                        <template slot-scope="scope">
                            {{ scope.row.FacilityStatus === 0 ? '未使用' :  (scope.row.FacilityStatus === 1 ? '使用中' : '离线') }}
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="Remark"
                        label="保养内容"
                        >
                    </el-table-column>
                    
                    <!-- <el-table-column
                        prop="Mobile"
                        label="联系方式"
                        >
                    </el-table-column>
                    <el-table-column
                        label="设备照片"
                    > -->
                    <!-- <template slot-scope="scope">
                       <el-image :src="scope.row.FacilityPictures"  v-if="scope.row.FacilityPictures"/>     
                       <el-image v-else>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                    </el-table-column> -->
                    <el-table-column
                        width="200px"
                        label="操作"
                        fixed="right"
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
                        :current-page="parentDefault.PageIndex"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="parentDefault.PageSize"
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
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection','parentEdit','parentDel','parentHandleSizeChange','parentHandleCurrentChange', 'parentOptionsList'],
    data() {
        return {
            multipleSelection: [],
            imageUrlPrev: window.$imgUrlPrev,
        }
    },
    methods: {
        //日期部分处理
        formatDate_date(val){
            if (!val) return '';
            let fmt = 'YYYY-MM-DD';
            return moment(val).format(fmt);
        },
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