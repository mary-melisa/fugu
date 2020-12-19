<template>
    <div class="userManage">
        <BreadCrumb :firstMenu="'系统管理'" :secondMenu="'角色管理'"></BreadCrumb>
        <div class="conditions">
            <el-input class="conditionInput" v-model="name" placeholder="请输入关键字"></el-input>
            <el-button class="conditionBtn" @click="getRolesList">查询</el-button>
        </div>
        <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加角色</el-button>
            <el-button  icon="el-icon-edit">编辑角色</el-button>
            <el-button  icon="el-icon-delete">删除角色</el-button>
        </el-row>
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
                    type="selection">
                </el-table-column>
                <el-table-column
                    label="序号"
                >
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="角色ID"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="角色名称"
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.toTalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import BreadCrumb from '@/components/breadCrumb/breadCrumb.vue';
export default {
     components: {
         BreadCrumb
     },
     data() {
        return {
            urlPrev: 'http://sysapi.free.idcfengye.com/',
            name: '',
            tableData: [],
            pageSize: 10,
            pageIndex: 1,
        };
    },
    mounted() {
        this.getRolesList();
    },
     methods: {
        handleSelectionChange(){

        },
        handleCurrentChange(){

        },
        handleSizeChange() {

        },
        // 获取角色列表
        getRolesList() {
            const url = this.urlPrev + `api/Roles/GetRolePageList`;
            const params = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                name: this.name
            }
            axios({ method: 'post', url: url, data: params })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.tableData = rsp.data;
                    } else {
                        console.log('获取角色列表失败！');
                        this.$alert('发送请求获取角色列表失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
            .catch(err => console.log(err));
        }
    }
}
</script>
<style lang="scss" scoped>
.userManage {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .conditions {
        padding: 11px 37px 21px 29px;
        border-bottom: 1px solid #BBBBBB;
        .conditionInput {
            width: 281px;
            height: 37px;
            color: #101010;
            font-size: 16px;
        }
        .conditionBtn {
            width: 83px;
            height: 37px;
            text-align: center;
            padding: 0;
            margin-left: 54px;
            background: #1890FF;
            color: white;
        }
        .conditionBtn:hover {
            background: rgba(24, 144, 255, .8);
        }
    }
    .operBtns {
        border-bottom: 0;
    }
    .tableContent {
        width: 100%;
        height: calc(100% - 274px);
    }
}
</style>