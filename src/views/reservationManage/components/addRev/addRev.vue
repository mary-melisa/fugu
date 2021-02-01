<template>
    <el-dialog class="commonDialog" width="400px" title="预定所需原料反算结果" align="center" :visible.sync="visible" :before-close="close" :close-on-click-modal="false">
    <el-table class="commonTable"  :data="gridData" label-width="35%">
        <el-table-column property="date" label="原料" ></el-table-column>
        <el-table-column property="name" label="数量" ></el-table-column>
        <el-table-column property="address" label="单位"></el-table-column>
    </el-table>
    <div class="button">
        <el-button class="commonButton" @click="close">取消</el-button>
        <el-button class="commonButton" >导出</el-button>
    </div>
</el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import { formatDate } from '@/filters/index';
export default {
    props: ['parentClo','parentDate'],
    data() {
        return {
        visible: true,
        manage:{
            nDate: this.parentDate,
            restaurantId: 1
        },
        gridData:[]
        }
    },
    mounted(){
        this.addRev();
    },
    methods: {
        close(){
            this.$emit('parentClo');
        },
        addRev(){
            axios({
                url: window.$config2+'api/DishesPlan/GetMaterialInverse',
                method: 'post',
                data: this.manage, 
            })
                .then(val => {
                console.log(val);
                if (val.data.status == 1) {
                        }else if(val.data.status == 0){
                            this.$message({
                                message: val.data.message,
                                type: 'error',
                            });
                        }
                this.gridData = val.data.result;
                })
                .catch(err => {
                throw err;
        });
        }
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
</style>