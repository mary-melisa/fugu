<template>
    <div class="mealSetting">
        <Breadcrumb />
        <Add/>
        <el-divider></el-divider>
        <div class="tableContent">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        class="commonTable"
                        tooltip-effect="dark"
                        height="100%"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            label="食堂编号"
                            width="106">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="食堂名称"
                            width="126">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="就餐人数"
                            width="155"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="业务模式"
                            label="所属上级"
                            width="155"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="负责人"
                            width="105"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="联系电话"
                            width="275"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址"
                            width="275"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="食堂照片"
                            width="280"
                        >
                        </el-table-column>
                    </el-table>
                    <!-- <el-table
                        ref="multipleTable"
                        :data="tableData"
                        class="commonTable"
                        tooltip-effect="dark"
                        height="100%"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            label="序号"
                            width="106">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="编号"
                            width="126">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="名称"
                            width="155"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="所属上级"
                            width="155"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="联系人"
                            width="105"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="联系人方式"
                            width="275"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="地址"
                            width="275"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            label="备注"
                            width="280"
                        >
                        </el-table-column>
                    </el-table> -->
                </div>
                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="40">
                    </el-pagination>
                </div>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue"
import Add from "./components/Add"
import axios from "axios"
export default {
    components:{
        Breadcrumb,
        Add
    },
    data() {
        return {
            baseurl:"http://172.16.9.124:8097/api",
            currentPage: 1,
            // menus: [{
            //     label: '孚谷餐饮有限公司',
            //     children: [{
            //         label: '组织机构二',
            //         children: [{
            //             label: '食堂一'
            //         }]
            //     }]
            // }],
            menus: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
        };
    },
    mounted() {
        this.getMenus();
    },
     methods: {
      handleNodeClick(data) {
          debugger
        console.log(data);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getMenus() {
            const url = `http://sysapi.free.idcfengye.com/api/Organization/GetOrganizationTree`;
            axios({ method: 'post', url: url })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        console.log(rsp);
                        this.menus = rsp.data.result;
                    } else {
                        console.log('获取组织架构树失败！');
                        this.$alert('发送请求获取组织架构树失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
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
    .mealSetting{
        margin: 20px;
    }
    .tableContent {
                margin-top: 30px;
                width: 100%;
                height: calc(100% - 75px);
            }
    .pagination {
                width: 100%;
                height: 60px;
                .el-pagination {
                    padding-top: 16px;
                }
                position:fixed; 
                bottom:40px; 
                margin-left:30%;
            }
</style>