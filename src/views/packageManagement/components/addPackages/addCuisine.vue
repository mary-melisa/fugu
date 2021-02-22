<template>
<!-- 选择菜品界面 -->
 <el-dialog
  class="commonDialog"
  title="选择菜品"
  :visible.sync="visible"
  :append-to-body="true"
  width="856px"
  :close-on-click-modal="false"
  :before-close="close">
    <div class="selectNutrient" style="position:relative;">
        <div class="search">
            <span class="ml10">菜品类别：</span>
               <el-select class="commonSelect" v-model="dishesCategoryId" style="width: 200px;">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in cla" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
                </el-select>
              <span style="margin-left:10px">菜品名称：</span>
              <el-input placeholder="请输入菜品名称" class="commonInput" v-model="name" style="width: 200px;"> </el-input>
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
                    align="right"
                >
                </el-table-column>
                <el-table-column
                width='60px'
                align="center"
                label="选择">
                </el-table-column>
                <el-table-column
                    prop="dishesName"
                    label="菜品名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="数量"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-input type="number" style="width: 120px;" v-model="scope.row.quantity" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder='请输入数量'></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="单位"
                    align="center"
                >
                份
                </el-table-column>
                <el-table-column
                    prop="categoryName"
                    label="菜品类别"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="菜品图片"
                    align="center"
                >
                 <template slot-scope="scope">
                    <img :src="`${scope.row.dishesPictures}`"/>
                </template>
                </el-table-column>
                <el-table-column
                    prop='price'
                    label="单价（元）"
                    align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination" style="position:relative;">
            <div style="position: absolute;left:100px;font-size:30px;top: 10px;" @click="terpineWeight">
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
        width="300px"
        :close-on-click-modal="false"
        :before-close="close1">
        <el-row class="commonRow" v-for="(item, index) in changeTerpineList" :key="index">
            <el-col :span="8">{{item.dishesName}}</el-col>
            <el-col :span="14"><el-input type="number" class="commonInput" style="width:80px;" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" v-model="item.quantity"  @blur="handleSelectionChange(parentMultipleSelection, item)"></el-input><span class="fl"> 份</span></el-col>
            <el-col :span="2" ><a @click="delDish(item)"><i class=" el-icon-delete"></i></a></el-col>
        </el-row>
    </el-dialog>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['closeParentModule', 'parentMultipleSelection', 'parentSetMultiple', 'parentDishes', 'cla'],
    data() {
        return {
            selectDefault: -1,
            visible: false,
            adddishesList: [],
            dishesCategoryId: this.selectDefault,   //菜品类别
            name: "",             //菜品名称
            materiaName: '',
            materialCategoryId: '',
            weightVisible: false,
            conditionForm: {
                pageIndex: 1,
                pageSize: 10
            },
            resultObj: {},
            weight:0,
            multipleSelection: [],
            bubble: 0,       //选中菜品的数量
            changeTerpineList: [],   //选中菜品集合
            initMultipleSelection: [], // 编辑时初始化复选框列表的值
        }
    },
    mounted(){
         this.visible = true;
         this.init();
         this.getDataTable();
    },
    methods: {
        onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
        // 查询
        select() {
            this.conditionForm.pageIndex = 1;
            this.getDataTable();
        },
        // 编辑时初始化选中物料列表
        init(){
            if(this.parentMultipleSelection && this.parentMultipleSelection.length){
                this.$nextTick(() => {
                    this.parentMultipleSelection.forEach(item => {
                        this.initMultipleSelection.push(JSON.parse(JSON.stringify(item)));
                    })
                    this.toggleSelection(this.parentMultipleSelection);
                });
            }
        },
         // 指定一个key标识这一行的数据
        getRowKey (row) {
            return row.id
        },
        // 选择菜品
        handleSelectionChange(val) {
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
            this.weightVisible = true;
        },
         //关闭弹框
        close() {
            this.$emit('parentSetMultiple', this.initMultipleSelection);
            this.$emit('closeParentModule', false);
        },
        //关闭菜品选择窗口
        close1() {
             let flag = true;
                this.parentMultipleSelection.every(item => {
                    if(!item.quantity) {
                        this.$message({
                            message: '请输入选中的菜品的重量',
                            type: 'warn'
                        })
                        flag = false;
                        return false;
                    }
                })  
                if(flag) {
                    console.log(this.parentMultipleSelection);
                   this.weightVisible = false;
                    // this.close();
                }
        },
       // 删除物料选择
        // delDish(row){
        //     let arr = this.parentMultipleSelection;
        //     arr.splice(arr.findIndex(item => item.id === row.id), 1);
        //     this.handleSelectionChange(arr);
        //     let rows = [];
        //     delete row.quantity;
        //     rows.push(row);
        //     this.toggleSelection(rows);
        // },
         // 删除菜品选择
        delDish(row){
            let rows = [];
            delete row.quantity;
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
            this.handleSelectionChange(newArr);
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
        // 获取菜品列表
        getDataTable() {
            let obj = {};
            obj.pageIndex = this.conditionForm.pageIndex;
            obj.pageSize = this.conditionForm.pageSize;
            if (this.dishesCategoryId != -1) {
               obj.dishesCategoryId = this.dishesCategoryId;
            }
            if(this.name) {
                obj.name = this.name;
            }
            const url = window.$config2 + `api/VarietyOfDishes/GetVarietyOfDishesPageList`;
            axios({ method: 'post', url: url, data: obj })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        console.log(rsp.data)
                        
                        // 解决翻页的时候复选框被取消的问题
                        let rows = rsp.data.result;
                          const selectlist = rows.map(x=>{
                            let select = this.parentMultipleSelection.find(i=>i.id === x.id);
                            if(select) return select;
                            else return x;
                        })
                        this.resultObj = rsp.data;
                        this.resultObj.result = selectlist;
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
            this.getDataTable();
        },
        handleCurrentChange(val){
            this.conditionForm.pageIndex = val;
            this.getDataTable();
        },
        checkQuantity(val) {
            return val && val > 0;
        },
        makeSure(){
            this.$message.closeAll();
            if(!this.changeTerpineList.length) {
                 this.$message({
                    message: '请选择至少一种菜品',
                    type: 'warn',
                });
                return false;
            }
            let flag = this.changeTerpineList.every(item => this.checkQuantity(item.quantity));  
            console.log(flag);
            if(!flag) {
                this.$message.closeAll();
                this.$message({
                    message: '请输入选中的菜品的数量',
                    type: 'warn'
                })
                return false;
            }
            if(flag) {
                console.log(this.changeTerpineList);
                this.$emit('parentSetMultiple', this.changeTerpineList);
                this.$emit('closeParentModule', false);
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
