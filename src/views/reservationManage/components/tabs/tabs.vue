<template>
    <el-table :data="tableData" height="100%" border style="width: 100%" class="commonTable" >
        <el-table-column prop="categoryType" align="center" label="餐别" >
            <template slot-scope="scope">
                <div v-if="scope.row.categoryType == 1">早餐</div>
            </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="菜单" ></el-table-column>
        <el-table-column prop="address" align="center" label="份数"> </el-table-column>
    </el-table>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import { formatDate } from '@/filters/index';
export default {
    props: [''],
    data() {
        return {
            activeName: 'one',
            tableData:[]
        }
    },
    mounted(){
    },
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep.commonDialog{  
        .el-dialog{
            min-height: 200px;
            .button{
                margin-top: 10px;
            }
            .el-dialog__body{
                min-height: 100px;
                padding:10px 8px;
                .mt45{
                    margin-top: 27px;
                }
            }
        }
    }
    ::v-deep.el-table.commonTable {
        .el-table__body-wrapper {
            height: 100% !important;
        }
    }
</style>