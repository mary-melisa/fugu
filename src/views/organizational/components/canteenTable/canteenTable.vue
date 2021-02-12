<template>
    <div class="canteenTable">
        <div class="tableContent">
            <div>
                <el-table
                :key="tableKey"
                ref="multipleTable1"
                :data="parentTableData1.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                stripe
                border>
                <el-table-column
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="序号"
                    >
                    <template slot-scope="scope"> {{ scope.$index + (cateenDefaultPages.pageIndex - 1) * cateenDefaultPages.pageSize + 1 }}</template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="食堂编号">
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
                   align="center"
                   min-width="80"
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
                <el-table-column label="操作" min-width="200" fixed="right">
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
                @size-change="changeCateenPageSize1"
                @current-change="changeCateenPageIndex1"
                :current-page="cateenDefaultPages.pageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="cateenDefaultPages.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="parentTableData1.toTalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    props: [ 
        'setFlag', 
        'parentTableData1',  
        'parentAdd', 
        'parentDel1',
        'changeActive',
        'parentCurrentCateen', 
        'cateenDefaultPages', 
        'setIsOrg', 
        'changeCateenPageSize', 
        'changeCateenPageIndex',
        'selectCanteen'
    ],
    data() {
        return {
            tableKey: Math.random(),
        }
    },
    mounted(){
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
        // 食堂页码
        changeCateenPageSize1(val) {
            this.$emit('changeCateenPageSize', val);
        },
        // 食堂当前页
        changeCateenPageIndex1(val) {
            if(val){
                this.$emit('changeCateenPageIndex', val);
            }else {
                this.$emit('changeCateenPageIndex', 1);
            }
        },
        // 删除食堂
        handleDelete1(rowObj) {
            let ids=[];
            ids.push(rowObj.id);
            this.$emit('parentDel1', ids);
            this.$emit('setIsOrg',0);
        },
        //编辑食堂
        handleEdit1(obj){
            console.log(obj);
            this.$emit('setFlag',2);
            this.$emit('changeActive','second');
            this.$emit('selectCanteen',obj);
            this.$emit('parentAdd',true); 
        },
    },
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