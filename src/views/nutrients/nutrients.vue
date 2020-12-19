<template>
    <div class="nutrients">
        <Breadcrumb :firstMenu="'基础数据'" :secondMenu="'营养成分'"/>
        <Search/>
        <el-divider></el-divider>
        <!-- 表格 -->
        <div class="organizationalRight">
        <CanteenTable :parentTableData="tableData" ></CanteenTable>
        </div>
    </div>
</template>

<script>
import CanteenTable from '@/views/nutrients/components/canteenTable.vue';
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue"
import Search from "@/components/Search/Search.vue"
import axios from 'axios'
export default {
       components: {
       Breadcrumb,
       Search,
       CanteenTable
    },
    data() {
      return {
        baseurl:"http://172.16.9.124:8097/api",
        tableData: [],
        menus:[]
      }
    },
    mounted(){
      this.getMenus();
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      getMenus() {
            const url = this.baseurl+`/bddishes/getdishes`;
            axios({ method: 'post', url: url })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        console.log(rsp);
                        this.menus = rsp.data.result;
                    } else {
                        console.log('获取失败！');
                        this.$alert('发送请求获取失败', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
    }
};
</script>

<style lang="scss" scoped>
    .nutrients{
        margin:0 29px 0 29px;
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
    .organizationalRight {
                margin-top: 30px;
                width: 100%;
                height: calc(100% - 75px);
        }
</style>