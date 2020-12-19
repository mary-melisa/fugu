<template>
    <div class="matCategory">
        <Breadcrumb :firstMenu="'基础数据'" :secondMenu="'物料类别'"/>
        <div class="model">
        <Add/>
        <Edit/>
        <Del/>
        </div>
        <el-divider></el-divider>
        <div class="table">
            <TableContent :parentTableData="result" :parentDefault="defaultProps"/>
        </div>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue"
import Add from "./components/Add"
import Del from "./components/Del"
import Edit from "./components/Edit"
import axios from "axios"
import TableContent from './components/TableContent.vue'
export default {
    components:{
        Breadcrumb,
        Add,
        Del,
        Edit,
        TableContent
    },
    data(){
        return{
            urlPrev: 'http://webapi.free.idcfengye.com/',
            currentPage: 1,
            defaultProps: {
                pageSize: '10',
                pageIndex: '1',
            },
            result: {},

        }
    },
    mounted() {
        this.getTableData();
    },
    methods:{
        //获取表格数据
        getTableData(){
            const url= this.urlPrev+`api/bdmateriatype/getmateriatype`;
            axios({method: 'post', url: url, data: this.defaultProps})
            .then(rsp=>{
                if(rsp.data.status==1){
                    console.log(rsp)
                    this.result=rsp.data;
                } else {
                    console.log("获取失败")
                }
            })
            .catch(err=> console.log(err));
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
.matCategory {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .model{
       @include flex();
        margin: 0 29px 0 29px;
    }
    .table{
        width: 100%;
        height: calc(100% - 202px);
        margin: 20px 29px 0 29px;
    }
}
</style>