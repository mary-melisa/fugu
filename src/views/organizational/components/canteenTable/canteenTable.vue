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
                @row-click="selectOrgan"
                @selection-change="handleSelectionChange1"
                stripe
                border>
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="序号"
                    >
                    <template slot-scope="scope"> {{ scope.$index + (parentDefaultPages.pageIndex - 1) * parentDefaultPages.pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column
                    prop="organizationName"
                    label="名称"
                   
                >
                </el-table-column>
                 <el-table-column
                    prop="id"
                    label="编号"
                   v-if="false"
                >
                </el-table-column>
                   <el-table-column
                    prop="parentId"
                    label="编号"
                   v-if="false"
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
            </div>
            <div v-else-if="parentTableNo === 2">
                <el-table
                ref="multipleTable"
                :data="parentTableData1.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                @row-click="selectCanteen"
                @selection-change="handleSelectionChange"
                stripe
                border>
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="序号"
                    >
                    <template slot-scope="scope"> {{ scope.$index + (parentDefaultPages.pageIndex - 1) * parentDefaultPages.pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="食堂编号">
                <!-- <template slot-scope="scope"> {{ scope.$index + (parentDefaultPages.pageIndex - 1) * parentDefaultPages.pageSize + 1 }}</template> -->
                </el-table-column>
                <el-table-column
                    prop="restaurantName"
                    label="食堂名称">
                </el-table-column>
                <el-table-column
                    prop="number"
                    label="就餐人数"
                >
                </el-table-column>
                <el-table-column
                    prop="patternName"
                    label="业务模式"
                >
                </el-table-column>
                <!-- <el-table-column
                    prop="parentName"
                    label="所属上级"
                >
                </el-table-column> -->
                <el-table-column
                    prop="userName"
                    label="负责人"
                >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="联系电话"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址"
                >
                </el-table-column>
                <el-table-column
                   label="食堂照片"
                   class-name="imgColumn"
                >
                    <!-- <template slot-scope="scope">
                        <el-image :src="scope.row.pictures"  style="width: 40px;height: 40px;"/>     
                        <el-image v-else>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <img :src="scope.row.pictures" min-width="40" height="40"/> 
                    </template> -->
                      <template slot-scope="scope">
                        <img  :src="scope.row.pictures" alt="" class="img" style="width: 40px;height: 40px;min-width: 40px;">
                      </template>

                </el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button
                            class="editBtn"
                            icon="el-icon-edit"
                            @click="handleEdit1(scope.row)">
                            编辑
                        </el-button>
                        <el-button
                            class="editBtn"
                            icon="el-icon-delete"
                            @click="handleDelete1(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </div>
        <div class="pagination">
            <el-pagination
                @size-change="changePageSize"
                @current-change="changePageIndex"
                :current-page="parentDefaultPages.pageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="parentDefaultPages.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="parentTableData.toTalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    props: [ 'setFlag','parentTableData', 'parentTableData1', 'parentActiveName', 'parentTableNo', 'parentDefaultPages', 'parentAdd', 'parentSelect', 'parentSetPageSize','parentSetPageIndex', 'parentDel','parentDel1','changeActive','parentCurrentCateen','parentCurrentCateen'],
    data() {
        return {
        }
    },
    methods: {
        //食堂
        handleSelectionChange(val) {
            let ids=[];
            val.forEach(item => {
                ids.push(item.id);
            });
            console.log(ids);
            this.$emit('parentCateeDels', ids);
            this.$emit('setIsOrg',0);
        },
        //组织
        handleSelectionChange1(val) {
            let ids=[];
            val.forEach(item => {
                ids.push(item.id);
            });
            console.log(ids);
            this.$emit('parentSelect', val);
            this.$emit('parentOrgDels', ids);
            this.$emit('setIsOrg',1);
        },
        changePageSize(val) {
            this.$emit('parentSetPageSize', val);
        },
        changePageIndex(val) {
            this.$emit('parentSetPageIndex', val);
        },
        // 当前选中组织
        selectOrgan(data) {
            this.$emit('setCurrentOrgan', data);
        },
        // 当前选中食堂
        selectCanteen(data) {
            this.$emit('setCurrentCanteen', data);
        },
         // 删除组织架构
        handleDelete(rowObj) {
            console.log("组织");
             let ids=[];
            ids.push(rowObj.id);
            this.$emit('parentDel', ids);
            this.$emit('setIsOrg',1);
        },
        // 删除食堂
        handleDelete1(rowObj) {
            let ids=[];
            ids.push(rowObj.id);
            this.$emit('parentDel1', ids);
            this.$emit('setIsOrg',0);
        },
        //编辑组织
        handleEdit(obj){
         console.log(obj);
            console.log(obj);
            this.$emit('setFlag',2);
            this.$emit('changeActive','first');
            this.$emit('parentCurrentOrgan',obj);
            this.$emit('parentAdd',true);
            
        },
        //编辑食堂
        handleEdit1(obj){
            console.log(obj);
            this.$emit('setFlag',2);
            this.$emit('changeActive','second');
            this.$emit('parentCurrentCateen',obj);
            this.$emit('parentAdd',true);
            
        },

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
.commonTable.el-table .el-table__body-wrapper .el-table__body td.img, th.img {
    width: 40px;
    min-width: 40px;
    height: 40px;
}
</style>