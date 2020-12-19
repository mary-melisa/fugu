<!-- 组织架构 -->
<template>
    <div class="organizational">
        <BreadCrumb :firstMenu="'系统管理'" :secondMenu="'组织架构'"></BreadCrumb>
        <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加</el-button>
            <el-button  icon="el-icon-edit">编辑</el-button>
            <el-button  icon="el-icon-delete">删除</el-button>
        </el-row>
        <div class="organizationlContent">
            <div class="organizationalLeft">
                <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick" ></el-tree>
            </div>
            <div class="organizationalRight">
                <CanteenTable :parentTableData="tableData" :parentTableNo="tableNo" :parentPageIndex="PageIndex" :parentPageSize="PageSize"></CanteenTable>
            </div>
        </div>
        <AddOrganizational v-on:cancelModule="cancelModule" v-if="dialogVisible"></AddOrganizational>
    </div>
</template>

<script>
import axios from 'axios';
import BreadCrumb from '@/components/breadCrumb/breadCrumb.vue';
import CanteenTable from '@/views/organizational/components/canteenTable/canteenTable.vue';
import AddOrganizational from '@/views/organizational/components/addOrganizational/addOrganizational.vue';
export default {
    components: {
        CanteenTable,
        AddOrganizational,
        BreadCrumb
    },
    data() {
        return {
            urlPrev: 'http://sysapi.free.idcfengye.com/',
            currentPage: 1,
            menus: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            PageSize: 10,
            PageIndex: 1,
            tableData: [],
            tableNo: 1, // 1代表组织机构下面的食堂列表   2代表食堂
            dialogVisible: false
        };
    },
    mounted() {
        this.getMenus();
    },
     methods: {
      handleNodeClick(data) {
          console.log('组织架构', data);
        // 获取组织架构下面的食堂列表
        if (data.children && data.children.length) {
            this.getCanteens(data);
            this.tableNo = 1;
        }
        else {
            if(data.isCanteen) {
                this.tableNo = 2;
                this.parentTableData = data;
            }else {
                this.getCanteenByOrgId(data);
            }
        }
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
      // 获取组织架构树
      getMenus() {
            const url = this.urlPrev + `api/Organization/GetOrganizationTree`;
            axios({ method: 'post', url: url })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.menus = rsp.data.result;
                        const secondMenus = [];
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
      // 获取组织架构下面的食堂列表
      getCanteens(item) {
          const url = this.urlPrev + `api/Restaurant/GetRestaurantServicePageList`;
          const params = {
              PageSize: this.PageSize,
              PageIndex: this.PageIndex
          }
          const currentItem = this.menus[0].children.filter(p => {p.id === item.id});
            axios({ method: 'post', url: url, data: params })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.tableData = rsp.data;
                        console.log(this.tableData, this.menus);
                    } else {
                        console.log('获取食堂列表失败！');
                        this.$alert('发送请求获取食堂列表失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
      // 根据组织获取食堂列表
      getCanteenByOrgId(data) {
           const url = this.urlPrev + `api/Restaurant/GetRestaurantServiceListByOrgId?OrgId=`+data.id;
            axios({ method: 'post', url: url })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        const rspDatas = rsp.data.result;
                        // this.tableData = rspDatas;
                        console.log('tableData', this.tableData)
                        rspDatas.forEach(item => {
                            item['isCanteen'] = true;
                        });
                        data.children = rspDatas;
                    } else {
                        console.log('获取食堂列表失败！');
                        this.$alert('发送请求获取食堂列表失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
      
      // 新增
      add() {
          this.dialogVisible = true;
      },
       // 关闭模态框回调
        cancelModule(val) {
            this.dialogVisible = false;
        },
    }
};
</script>

<style scoped lang="scss">
.organizational {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .organizationlContent {
        width: 100%;
        height: calc(100% - 135px);
        @include flex();
        .organizationalLeft {
            width: 215px;
            height: 100%;
            background: white;
            overflow-y: auto;
            .el-tree {
                padding-top: 15px;
            }
        }
        .organizationalRight {
            flex: 1;
            max-width: calc(100% - 215px);
            padding-top: 15px;
        }
    }
}
</style>
