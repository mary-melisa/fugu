<template>
 <el-dialog
  class="commonDialog"
  title="选择物料"
  :visible.sync="visible"
  :append-to-body="true"
  width="856px"
  :close-on-click-modal="false"
  :before-close="close">
    <div class="selectNutrient">
        <div class="search">
              <span>物料名称：</span>
              <el-input placeholder="请输入物料名称" class="commonInput" v-model="materialName" style="width: 200px;"> </el-input>
              <span class="ml10">物料类别：</span>
               <el-select class="commonSelect" v-model="materialCategoryId" style="width: 200px;">
                    <el-option :value="defaultSelect" label="请选择">请选择</el-option>
                    <el-option v-for="item in adddishesList" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
                </el-select>
              <el-button class="conditionBtn" @click="select">查询</el-button>
        </div>
        <!-- 表格 -->
        <div class="tableContent">
           <el-table
                ref="multipleTable"
                :data="resultObj.result"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                stripe
                border
                :row-key="getRowKey"
               @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    :selectable='checkSelect'>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="物料编号"
                >
                </el-table-column>
                <el-table-column
                    prop="materialName"
                    label="物料名称"
                >
                </el-table-column>
                <el-table-column
                    prop="materialCategoryName"
                    label="物料类别"
                >
                </el-table-column>
                <el-table-column
                    prop="materialStatus"
                    label="营养配置状态"
                >
                </el-table-column>
                </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="conditionForm.pageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="conditionForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resultObj.toTalCount">
            </el-pagination>
        </div>
        <div class="buttonBlocks">
            <el-button class="commonButton" @click.native="close">取消</el-button>
            <el-button class="commonButton" @click.native="makeSure">确定</el-button>
        </div>
    </div>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['getParentTableData', 'closeParentModule', 'parentSelectNutrients', 'parentAdddishesList'],
    data() {
        return {
            urlPrev: 'http://39.106.7.166:8097/',
            defaultSelect: -1,
            visible: true,
            adddishesList: [],
            materialName: '',
            materialCategoryId: this.defaultSelect,
            conditionForm: {
                pageIndex: 1,
                pageSize: 10
            },
            pageIndex: 1,
            pageSize: 10,
            resultObj: {},
            multipleSelection: [],
        }
    },
    mounted(){
        // 获取物料类别下拉框
         this.getNutrients();
         // 获取物料列表
         this.getMaterialDetail();

         this.init();
    },
    methods: {
        init(){
            this.$nextTick(() => {
                if(this.parentAdddishesList && this.parentAdddishesList.length) {
                    this.multipleSelection = this.parentAdddishesList;
                    this.multipleSelection.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    })
                }
            })
        },
        // 查询
        select(){
            this.conditionForm.pageIndex = 1;
            this.getMaterialDetail();
        },
         // 指定一个key标识这一行的数据
        getRowKey (row) {
            return row.id
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        checkSelect(row, index){
            if(row.materialStatus === '已配置') {
                return 0;
            }else {
                return 1;
            }
        },
         //关闭弹框
        close() {
            this.$emit('closeParentModule');
        },
        // 获取物料类别下拉列表
        getNutrients() {
            let obj = {};
            obj.pageIndex = 1;
            obj.pageSize = 1000;
            const url= this.urlPrev + `api/bdmateriatype/getmateriatype`;
            axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.adddishesList = rsp.data.result;
                } else if(rsp.data.status == 0){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error'
                    });
                }
            })
            .catch(err=> console.log(err));
        },
        // 获取物料列表
        getMaterialDetail() {
            const url = this.urlPrev + `api/bddishes/getmaterialdetail`;
            let obj = {};
            obj.pageSize = this.conditionForm.pageSize;
            obj.pageIndex = this.conditionForm.pageIndex;
            if(this.materialName !== "" ){
                obj.materialName = this.materialName;
            }
            if(this.materialCategoryId !== this.defaultSelect) {
                obj.materialCategoryId = this.materialCategoryId;
            }
            axios({ method: 'post', url: url, data: obj })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.resultObj = rsp.data;
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => console.log(err));
        },
        handleSizeChange(val){
            this.conditionForm.pageSize = val;
            this.conditionForm.pageIndex = 1;
            this.getMaterialDetail();
        },
        handleCurrentChange(val){
            this.conditionForm.pageIndex = val;
            this.getMaterialDetail();
        },
        makeSure(){
             this.$message.closeAll();
            if(!this.multipleSelection.length) {
                 this.$message({
                    message: '请选择至少一种物料',
                    type: 'warn',
                });
            }else {
                this.$emit('parentSelectNutrients', this.multipleSelection);
                this.$emit('closeParentModule');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .selectNutrient {
        @include flex();
        flex-direction: column;
    }
    .operBtn {
        .el-button:first-child {
            margin-left: 0;
        }
    }
    .search {
        border-bottom: 0;
    }
    .tableContent {
        min-height: 350px;
        width: 100%;
        .el-table {
            min-height: 350px;
        }
    }
    
</style>