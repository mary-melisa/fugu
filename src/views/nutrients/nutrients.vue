<template>
    <div class="nutrients">
        <Breadcrumb />
        <Search/>
        <el-divider></el-divider>
        <!-- 表格 -->
        <div class="table">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                label="日期"
                width="180"
                style="border-bottom-color:#C0C0C0"
                >
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="姓名"
                width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                    </el-popover>
                </template>
                </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
            </el-table>
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
import Search from "@/components/Search/Search.vue"
import axios from 'axios'
export default {
       components: {
       Breadcrumb,
       Search
    },
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
};
</script>

<style lang="scss" scoped>
    .nutrients{
        margin: 20px
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