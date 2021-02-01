<template>
 <el-dialog
  class="commonDialog"
  title="选择套餐"
  :visible.sync="visible"
  :append-to-body="true"
  width="1000px"
  :close-on-click-modal="false"
  :before-close="close">
    <div class="selectNutrient" style="position:relative;">
        <div class="search">
            <span class="ml10">套餐类别：</span>
               <el-select class="commonSelect" v-model="dishesCategoryId" style="width: 200px;">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in adddishesList" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
                </el-select>
              <span style="margin-left:10px">套餐名称：</span>
              <el-input placeholder="请输入套餐名称" class="commonInput" v-model="name" style="width: 200px;"> </el-input>
              <el-button class="conditionBtn ml15"  @click="getTableData">查询</el-button>
              <el-button class="conditionBtn ml25" @click="tocreate" >添加套餐</el-button>
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
               @selection-change="handleSelectionChange($event, mealMultipleSelection)">
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
                    prop="setMealName"
                    label="套餐名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="categoryName"
                    label="类别"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="计划份数"
                    align="center">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.quantity" placeholder='请输入重量' @blur="handleSelectionChange(mealMultipleSelection, scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination" style="position:relative;">
            <div style="position: absolute;left:140px;font-size:30px;" @click="terpineWeight">
                <el-badge :value="mealMultipleSelection && mealMultipleSelection.length ? mealMultipleSelection.length : 0" class="item"  >
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
        title="套餐选择"
        :visible.sync="weightVisible"
        :append-to-body="true"
        width="300px"
        :close-on-click-modal="false"
        :before-close="close1">
        <el-row class="commonRow" v-for="(item, index) in mealMultipleSelection" :key="index">
                <el-col :span="10">{{item.setMealName}}</el-col>
                <el-col :span="12"><el-input type="number" class="commonInput" style="width:80px;" v-model="item.quantity"  @blur="handleSelectionChange(mealMultipleSelection, item)"></el-input><span class="fl"> 份</span></el-col>
                <el-col :span="2" ><a @click="delDish(item)"><i class=" el-icon-delete"></i></a></el-col>
        </el-row>
    </el-dialog>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['getParentTableData', 'closeParentModule', 'parentSetMealList', 'mealMultipleSelection'],
    components:{
        
    },
    data() {
        return {
            flag: 1, // 1赋值   2push
            urlPrev: window.$config2,
             urlMater: window.$config1,
            visible: true,
            adddishesList: [],
            selectDefault: -1,
            name: '',
            dishesCategoryId: this.selectDefault,
            weightVisible: false,
            dialogVisible: false,
            title: 1, // 1 新增备菜计划  2编辑备菜计划
            currentMeal: {},     // 当前选中菜品
            conditionForm: {
                pageIndex: 1,
                pageSize: 10
            },
            pageIndex: 1,
            pageSize: 10,
            resultObj: {},
            weight:0,
            multipleSelection: [],
            bubble: 0,       //选中菜品的数量
            changeTerpineList: []   //选中菜品集合
        }
    },
    mounted(){
         this.init();
         this.flag = 1;
         this.visible = true;
         this.getNutrients();
         this.getTableData();
    },
    methods: {
          // 指定一个key标识这一行的数据
        getRowKey (row) {
            return row.id
        },
        // 编辑时初始化选中物料列表
        init(){
            if(this.mealMultipleSelection && this.mealMultipleSelection.length){
                this.$nextTick(() => {
                    this.$emit('parentSetMultiple', this.mealMultipleSelection);
                    this.toggleSelection(this.mealMultipleSelection);
                });
            }
        },
        // 跳转到新增套餐路由
        tocreate() {
            this.$router.push({
                name: 'packageManagement',
                params: {
                    flag: 'add'
                }
            });
        },
         // 删除菜品选择
        // delDish(row){
        //     let arr = this.mealMultipleSelection;
        //     arr.splice(arr.findIndex(item => item.id === row.id), 1);
        //     this.handleSelectionChange(arr, {});
        //     let rows = [];
        //     delete row.quantity;
        //     console.log(row);
        //     rows.push(row);
        //     this.toggleSelection(rows);
        //     debugger
        // },
         // 删除菜品选择
        delDish(row){
            let rows = [];
            delete row.quantity;
            console.log(row);
            if(Object.keys(row).length) {
                rows.push(row);
            }
            let arr = this.mealMultipleSelection;
            let newArr = arr.filter(function (item) {
                return item.id != row.id  //将数组中的某个对象去掉
            })
            console.log(newArr);
            this.toggleSelection(rows);
            this.handleSelectionChange(newArr, {});
        },
         // 切换选中取消菜品
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        //获取表格数据
        async getTableData(){
            let obj = {};
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            if(this.name) {
                obj.name = this.name;
            }
            if(this.dishesCategoryId !== -1) {
                obj.dishesCategoryId = this.dishesCategoryId;
            }
            const url= this.urlPrev+`api/SetMealManagement/GetSetMealManagementPageList`;
            await axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                     // 解决翻页的时候复选框被取消的问题
                        let rows = rsp.data.result;
                        this.mealMultipleSelection.forEach(item => {
                            if(item && item.quantity){
                                let obj = rows.find(res => res.id === item.id);
                                if(obj && Object.keys(obj).length){
                                    obj['quantity'] = item.quantity;
                                }
                            }
                        })
                        this.resultObj = rsp.data;
                        this.resultObj.result = rows;
                } else{
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
        // 选择菜品
        handleSelectionChange(val, row) {
            let meals = val;
             
            meals.forEach(item => {
                if(item.id === row.id) {
                    if(row.quantity) {
                    item.quantity = row.quantity;
                    }else {
                        delete item.quantity;
                    }
                }
            })
            
            this.$nextTick(() => {
                this.$emit('parentSetMealList', meals);
            });
        },
        checkSelect(row, index){
            this.changeTerpineList = row
            // this.weightVisible = true
            if(row.materialStatus === '已配置') {
                return 1;
            }else {
                return 0;
            }
        },
        //菜品重量设置弹窗
        terpineWeight(){
            this.weightVisible = true;
        },
         //关闭弹框
        close() {
            this.$emit('closeParentModule', false);
        },
        //关闭菜品选择窗口
        close1() {
             let flag = true;
            this.mealMultipleSelection.every(item => {
                if(!item.quantity) {
                    this.$message({
                        message: '请输入选中的套餐的重量',
                        type: 'warn'
                    })
                    flag = false;
                    return false;
                }
            })        
            if(flag) {
                this.weightVisible = false;
                this.close();
            }      
           
        },
        // 获取物料类别下拉列表
        getNutrients() {
             const url=this.urlMater +  `api/bddishescategory/getdishescategory`;
            axios({method: 'post', url: url, data: this.conditionForm})
            .then( res => {
                this.adddishesList = res.data.result
            })
          
        },
       
         async handleSizeChange(val){
            this.conditionForm.pageSize = val;
            this.pageSize = val;
            this.pageIndex = 1;
            this.conditionForm.pageIndex = 1;
            await this.getTableData();
        },
        async handleCurrentChange(val){
            this.conditionForm.pageIndex = val;
            this.pageIndex = val;
            await this.getTableData();
        },
        makeSure(){
             this.$message.closeAll();
            // if(!this.mealMultipleSelection.length) {
            //      this.$message({
            //         message: '请选择至少一种套餐',
            //         type: 'warn',
            //     });
            //     return false;
            // }else {
                let flag = true;
                this.mealMultipleSelection.every(item => {
                    if(!item.quantity) {
                        this.$message({
                            message: '请输入选中的套餐的重量',
                            type: 'warn'
                        })
                        flag = false;
                        return false;
                    }
                })        
                if(flag) {
                        this.$emit('closeParentModule', false);
                }       
            // }
        }
    },
    watch: {
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
        min-height: 700px;  
        .el-dialog{
            min-height: 200px;
            .el-dialog__body{
                min-height: 100px;
                padding:10px 8px;
            }
        }
    }
</style>
