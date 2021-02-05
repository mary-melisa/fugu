<template>
 <el-dialog
  class="commonDialog"
  title="选择物料"
  :visible.sync="visible"
  :append-to-body="true"
  width="1000px"
  :close-on-click-modal="false"
  :before-close="close">
    <div class="selectNutrient" style="position:relative;z-index:4">
        <div class="search">
            <span class="ml10">物料类别：</span>
               <el-select class="commonSelect" v-model="materialCategoryId" style="width: 200px;">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in adddishesList" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
                </el-select>
              <span style="margin-left:10px">物料名称：</span>
              <el-input placeholder="请输入物料名称" class="commonInput" v-model="materialName" style="width: 200px;"> </el-input>
              <el-button class="conditionBtn ml15"  @click="getMaterialDetail">查询</el-button>
              <el-button class="conditionBtn ml25" @click="tocreate">添加新物料</el-button>
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
                :row-key="getRowKey"
                stripe
                border
               @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    align="right"
                >
                </el-table-column>
                <el-table-column
                width='60px'
                align="center"
                label="选择">
                </el-table-column>
                <el-table-column
                    prop="materialCategoryName"
                    label="物料类别"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="materialName"
                    label="物料名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="重量（g）"
                    align="center">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.materialUnit" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder='请输入重量'></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination" style="position:relative;">
            <div style="position: absolute;left:140px;font-size:30px;" @click="terpineWeight">
                <el-badge :value="changeTerpineList && changeTerpineList.length ? changeTerpineList.length : 0" class="item"  >
                    <i class="el-icon-shopping-cart-2"></i>
                </el-badge>
            </div>
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
    <!-- 菜品选择弹窗 -->
    <el-dialog
        class="commonDialog"
        title="菜品选择"
        :visible.sync="weightVisible"
        :append-to-body="true"
        width="280px"
        :close-on-click-modal="false"
        :before-close="close1">
        <el-row class="commonRow" v-for="(item, index) in changeTerpineList" :key="index">
                <el-col :span="8">{{item.materialName}}</el-col>
                <el-col :span="14"><el-input type="number" class="commonInput" style="width:80px;" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" v-model="item.materialUnit"></el-input><span class="fl"> g</span></el-col>
                <el-col :span="2" ><a @click="delDish(item)"><i class=" el-icon-delete"></i></a></el-col>
        </el-row>
    </el-dialog>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['closeParentModule', 'parentMultipleSelection', 'parentSetMultiple', 'parentCloseModule', 'parentDishes', 'setNetContent'],
    data() {
        return {
            visible: false,
            adddishesList: [],
            selectDefault: -1,
            materialName: '',
            materialCategoryId: this.selectDefault,
            weightVisible: false,
            dialogVisible: false,
            title: 1, // 1 新增餐别  2编辑餐别
            conditionForm: {
                pageIndex: 1,
                pageSize: 10
            },
            flag: 1, // 1赋值   2push
            pageIndex: 1,
            pageSize: 10,
            resultObj: {},
            weight:0,
            bubble: 0,       //选中菜品的数量
            changeTerpineList: []   //初始化菜品数组
        }
    },
    mounted(){
         this.visible = true;
         this.flag = 1;
         this.init();
         this.getNutrients();
         this.getMaterialDetail();
         this.getTableData();
    },
    methods: {
        onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
        // 编辑时初始化选中物料列表
        async init(){
            if(this.parentMultipleSelection && this.parentMultipleSelection.length){
                //this.changeTerpineList = this.parentMultipleSelection;
                await this.$nextTick(() => {
                //     this.$emit('parentSetMultiple', this.parentMultipleSelection);
                //     this.toggleSelection(this.changeTerpineList);
                    this.parentMultipleSelection.forEach((item, index) => {
                        // this.changeTerpineList[index] = item;
                        this.$refs.multipleTable.toggleRowSelection(item, true);
                    });
                    this.changeTerpineList = this.parentMultipleSelection;
                    console.log(this.changeTerpineList, 'changeTerpineList');
                })  
                //this.toggleSelection(this.changeTerpineList);
            }
        },
         // 指定一个key标识这一行的数据
        getRowKey (row) {
            return row.id
        },
        //选中的物料
        selectDis(row){
            console.log(row.id)
        },
        // 跳转到新增物料路由
        tocreate() {
            this.$router.push({
                name: 'matInformation',
                params: {
                    flag: 'add'
                }
            });
        },
        // 删除物料选择
        // delDish(row){
        //     let arr = this.parentMultipleSelection;
        //     arr.splice(arr.findIndex(item => item.id === row.id), 1);
        //     this.handleSelectionChange(arr, {});
        //     let rows = [];
        //     delete row.materialUnit;
        //     rows.push(row);
        //     this.toggleSelection(rows);
        // },
        delDish(row){
            let rows = [];
            delete row.materialUnit;
            console.log(row);
            if(Object.keys(row).length) {
                rows.push(row);
            }
            let arr = this.parentMultipleSelection;
            let newArr = arr.filter(function (item) {
                return item.id != row.id  //将数组中的某个对象去掉
            })
            console.log(newArr);
            this.toggleSelection(rows);
            this.handleSelectionChange(newArr, {});
        },
        // 初始化数据
        initData(){
          const flag = this.$route.params.flag;
         if(flag === 'add') {
           this.title = 1;
           this.dialogVisible = true;
         }
        },
        //获取表格数据
        getTableData(){
            const url= window.$config1 +`api/bdmaterial/getmaterial`;
            axios({method: 'post', url: url, data: this.conditionForm})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                } else{
                    this.$message.closeAll();
                    this.$message( {
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err=> console.log(err));
        },
        // 新增物料
        add() {
            this.title = 1;
            this.dialogVisible = true;
        },
        // 关闭模态框回调
        cancelModule(val) {
            this.dialogVisible = false;
        },
        // 选择物料
        // async handleSelectionChange(val, row) {
        //     let meals = val;
            
        //     meals.forEach(item => {
        //         if(item.id === row.id) {
        //                 if(row.materialUnit) {
        //                     item.materialUnit = row.materialUnit;
        //                 }else {
        //                     delete item.materialUnit;
        //                 }
        //         }
        //     })
        //     this.$nextTick(() => {
        //         this.$emit('parentSetMultiple', meals);
        //     })
            
        // },
        handleSelectionChange(val){
            const res = new Map();
            let arr =  val.filter((val) => !res.has(val.id) && res.set(val.id, 1));
            this.changeTerpineList.length = 0;
            arr.forEach(item => {
                this.changeTerpineList.push(item);
            })
            console.log(this.changeTerpineList);
        },
        //菜品重量设置弹窗
        terpineWeight(){
             console.log(this.changeTerpineList);
            if(this.changeTerpineList.length){
                this.weightVisible = true;
            }else {
                this.$message.closeAll();
                this.$message({
                    message: '请先选择至少一种物料',
                    type: 'warn'
                })
            }
        },
         //关闭弹框
        close() {
            console.log(this.changeTerpineList, 'changeTerpineList');
            console.log(this.parentMultipleSelection);
            // this.$emit('parentSetMultiple', this.changeTerpineList);
            // this.$emit('closeParentModule', false);
        },
        //关闭菜品选择窗口
        async close1() {
            let flag = true;
             this.parentMultipleSelection.every(item => {
                if(!item.materialUnit) {
                    this.$message.closeAll();
                    this.$message({
                        message: '请输入选中的物料的重量',
                        type: 'warn'
                    })
                    flag = false;
                    return false;
                }
            })
            if(flag) {
                let weight = 0;
                this.parentMultipleSelection.forEach(item => {
                    weight += Number(item.materialUnit);
                })
                this.$emit('setNetContent', weight);
                this.weightVisible = false;
                // this.$emit('parentSetMultiple', []);
                if(!this.changeTerpineList.length) {
                    await this.getMaterialDetail();
                    await this.init();
                }
               // this.close();
            }
        },
        // 获取物料类别下拉列表
        getNutrients() {
            var params={
                pageIndex:1,
                pageSize:1000
            }
           const url= window.$config1 + `api/bdmateriatype/getmateriatype`;
            axios({method: 'post', url: url, data: params})
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
        async getMaterialDetail() {
            let obj = {};
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            if(this.materialName != "" ){
                obj.materialName = this.materialName;
            }
            if(this.materialCategoryId != -1) {
                obj.materialCategoryId = this.materialCategoryId;
            }
            const url = window.$config1 + `api/bddishes/getmaterialdetail`;
            await axios({ method: 'post', url: url, data: obj })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        // 解决翻页的时候复选框被取消的问题
                        let rows = rsp.data.result;
                        this.parentMultipleSelection.forEach(item => {
                            if(item && item.materialUnit){
                                let obj = rows.find(res => res.id === item.id);
                                if(obj && Object.keys(obj).length){
                                    obj['materialUnit'] = item.materialUnit;
                                }
                            }
                        })
                        this.resultObj = rsp.data;
                        this.resultObj.result = rows;
                        // 重置表单字段
                        // let obj = {};
                        // Object.keys(this.conditionForm).forEach(key => {
                        //     if(key === 'pageSize' || key === 'pageIndex') {
                        //         obj[key] = this.conditionForm[key];
                        //     }
                        // })
                        // this.conditionForm = obj;
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => console.log(err));
        },
         // 切换选中取消物料
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        async handleSizeChange(val){
            // flag = 1 赋值  2 push
             console.log("add1");
            this.pageSize = val;
            this.conditionForm.pageSize = val;
            this.pageIndex = 1;
            this.conditionForm.pageIndex = 1;
            await this.getMaterialDetail();
        },
        async handleCurrentChange(val){
            console.log("add");
            this.pageIndex = val;
            // flag = 1 赋值  2 push
            this.conditionForm.pageIndex = val;
            await this.getMaterialDetail();
        },
        makeSure(){
             this.$message.closeAll();
            if(!(this.parentMultipleSelection.length || this.changeTerpineList.length) ) {
                    this.$message.closeAll();
                    this.$message({
                        message: '请选择至少一种物料',
                        type: 'warn',
                    });
                    return false;
            }else {
                let flag = true;
                this.parentMultipleSelection.every(item => {
                    if(!item.materialUnit) {
                        flag = false;
                        return false;
                    }
                })
                if(flag === false) {
                    this.changeTerpineList.every(item => {
                        if(!item.materialUnit){
                            this.$message.closeAll();
                             this.$message({
                                message: '请输入选中的物料的重量',
                                type: 'warn'
                            })
                            return false;
                        }
                    })
                }
                if(flag) {
                    let weight = 0;
                    if(this.parentMultipleSelection.length) {
                        this.parentMultipleSelection.forEach(item => {
                            weight += Number(item.materialUnit);
                        })
                        this.$emit('parentSetMultiple', this.parentMultipleSelection);
                    }else if(this.changeTerpineList.length){
                         this.changeTerpineList.forEach(item => {
                            weight += Number(item.materialUnit);
                        })
                        this.$emit('parentSetMultiple', this.changeTerpineList);
                    }
                    this.$emit('setNetContent', weight);
                    console.log(this.parentMultipleSelection);
                    this.$emit('parentCloseModule', false);
                }
            }
        }
    },
    watch: {
        // changeTerpineList: {
        //     handler: function (newValue, oldValue) {
        //         eventBus.$emit('parentSetMultiple', newValue);  
        //     },
        //     deep: true
        //  },
        // parentMultipleSelection: {
        //     handler: function (newValue, oldValue) {
        //         newValue.forEach(item => {
        //             const obj = this.resultObj.result.filter(res => res.id === item.id);
        //             obj.materialUnit = item.materialUnit;
        //         })
        //     },
        //     deep: true
        // },
        pageIndex: {
             handler: function (newValue, oldValue) {
                if(newValue != oldValue){
                    this.flag = 2;
                }
            },
            deep: true
        },
        pageSize: {
             handler: function (newValue, oldValue) {
                if(newValue != oldValue){
                    this.flag = 2;
                }
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
    .commonRow.el-row {
        .commonInput.el-input {
            margin-right: 10px;
            margin-left: 10px;
        }
        .el-col {
            a {
                display: inline-block;
                padding: 0 5px;
                .el-icon-delete {
                    line-height: 30px;
                }
            }
        }
    }
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
    .item {
        margin-top: 10px;
        margin-right: 40px;
    }
    ::v-deep.commonDialog{  
        .el-dialog{
            min-height: 200px;
            .el-dialog__body{
                min-height: 100px;
                padding:10px 8px;
            }
        }
    }
</style>
