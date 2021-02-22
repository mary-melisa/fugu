<template>
    <div class="organizationTable">
        <div class="tableContent">
            <div>
                <el-table
                :key="tableKey"
                ref="multipleTable"
                :data="parentTableData.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
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
    props: [ 
        'setFlag',
        'parentTableData', 
        'parentDefaultPages', 
        'parentAdd', 
        'parentSelect', 
        'parentSetPageSize',
        'parentSetPageIndex', 
        'parentDel',
        'changeActive', 
        'isorg',
        'selectOrgan',
        'parentOrgDels'],
    data() {
        return {
            tableKey: Math.random(),
        }
    },
    mounted(){
    },
    methods: {
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
        // 更改页码
        changePageSize(val) {
            this.$emit('parentSetPageSize', val);
        },
        // 更改当前页
        changePageIndex(val) {
            if(val){
                this.$emit('parentSetPageIndex', val);
            }else {
                this.$emit('parentSetPageIndex', 1);
            }
        },

         // 删除组织架构
        handleDelete(rowObj) {
            console.log("组织");
             let ids=[];
            ids.push(rowObj.id);
            this.$emit('parentDel', ids);
            this.$emit('setIsOrg',1);
        },
        //编辑组织
        handleEdit(obj){
         console.log(obj);
            console.log(obj);
            this.$emit('setFlag',2);
            this.$emit('changeActive','first');
            this.$emit('selectOrgan',obj);
            this.$emit('parentAdd',true);
        },
    }
}
</script>
<style lang="scss" scoped>
.organizationTable {
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