<template>
 <el-dialog
  class="commonDialog"
  title="选择菜品"
  :visible.sync="visible"
  :append-to-body="true"
  width="1000px"
  :close-on-click-modal="false"
  :before-close="close">
    <div class="selectNutrient" style="position:relative;">
        <div class="search">
            <span class="ml10">菜品类别：</span>
               <el-select class="commonSelect" v-model="dishesCategoryId" style="width: 200px;">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in adddishesList" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
                </el-select>
              <span style="margin-left:10px">菜品名称：</span>
              <el-input placeholder="请输入物料名称" class="commonInput" v-model="name" style="width: 200px;"> </el-input>
              <el-button class="conditionBtn ml15"  @click="select">查询</el-button>
              <el-button class="conditionBtn ml25" @click="tocreate" >添加菜品</el-button>
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
                    prop="dishesName"
                    label="菜品名称"
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
                        <el-input type="number" v-model="scope.row.quantity" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder='请输入重量'></el-input>
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
        width="350px"
        :close-on-click-modal="false"
        :before-close="close1">
        <el-row class="commonRow" v-for="(item) in changeTerpineList" :key="item.id">
                <el-col :span="10">{{item.dishesName}}</el-col>
                <el-col :span="12"><el-input type="number" class="commonInput" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" style="width:80px;" v-model="item.quantity"></el-input><span class="fl"> 份</span></el-col>
                <el-col :span="2" ><a @click="delDish(item)"><i class=" el-icon-delete"></i></a></el-col>
        </el-row>
    </el-dialog>
</el-dialog>
</template>
<script>
import axios from 'axios';
export default {
    props: ['closeParentModule', 'parentSetDishList', 'dishMultipleSelection'],
    components:{
        
    },
    data() {
        return {
            flag: 1, // 1赋值   2push
            selectDefault: -1,
            urlPrev: window.$config2,
            urlMater: window.$config1,
            visible: false,
            adddishesList: [],
            materiaName: '',
            materialCategoryId: '',
            weightVisible: false,
            dialogVisible: false,
            title: 1, // 1 新增备菜计划  2编辑备菜计划
            currentMeal: {},     // 当前选中菜品
            dishesCategoryId: this.selectDefault, // 查询条件菜品类别
            name:  '', // 查询条件菜品名称
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
            changeTerpineList: [],   //选中菜品集合
            initMultipleSelection: [],
            freshFlag: false  
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
        onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
        // 查询
        select(){
            this.conditionForm.pageIndex = 1;
            this.getTableData();
        },
        // 编辑时初始化选中物料列表
        init(){
            if(this.dishMultipleSelection && this.dishMultipleSelection.length){
                this.$nextTick(() => {
                    this.dishMultipleSelection.forEach(item => {
                        this.initMultipleSelection.push(JSON.parse(JSON.stringify(item)));
                    })
                    this.toggleSelection(this.dishMultipleSelection);
                });
            }
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
            const url= this.urlPrev + `api/VarietyOfDishes/GetVarietyOfDishesPageList`;
            await axios({method: 'post', url: url, data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                     // 解决翻页的时候复选框被取消的问题
                        let rows = rsp.data.result;
                        // this.dishMultipleSelection.forEach(item => {
                        //     if(item && item.quantity){
                        //         let obj = rows.find(res => res.id === item.id);
                        //         if(obj && Object.keys(obj).length){
                        //             obj['quantity'] = item.quantity;
                        //         }
                        //     }
                        // })
                        const selectList = rows.map(item => {
                            const select = this.dishMultipleSelection.find(i => i.id === item.id);
                            if(select) return select;
                            else return item;
                        })
                        this.resultObj = rsp.data;
                        this.resultObj.result = selectList;
                } else if(rsp.data.message){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err=> console.log(err));
        },
         // 指定一个key标识这一行的数据
        getRowKey (row) {
            return row.id
        },
        // 跳转到新增菜品路由
        tocreate() {
            this.$router.push({
                name: 'dishManagement',
                params: {
                    flag: 'add'
                }
            });
        },
         // 删除菜品选择
        delDish(row){
            let rows = [];
            delete row.quantity;
            console.log(row);
            if(Object.keys(row).length) {
                rows.push(row);
            }
            let arr = this.dishMultipleSelection;
            let newArr = arr.filter(function (item) {
                return item.id != row.id  //将数组中的某个对象去掉
            })
            console.log(newArr);
            this.toggleSelection(rows);
            this.handleSelectionChange(newArr);
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
        handleSelectionChange(val) {
            const res = new Map();
            let arr =  val.filter((val) => !res.has(val.id) && res.set(val.id, 1));
            this.changeTerpineList.length = 0;
            arr.forEach(item => {
                this.changeTerpineList.push(item);
            })
            console.log(this.changeTerpineList);
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
            this.dishMultipleSelection.every(item => {
                if(!item.quantity) {
                    this.$message.closeAll();
                    this.$message({
                        message: '请输入选中的菜品的重量',
                        type: 'warn'
                    })
                    flag = false;
                    return false;
                }
            })        
            if(flag) {
                this.$emit('parentSetDishList', this.initMultipleSelection);
                this.weightVisible = false;
                // this.close();
            }      
          
        },
        // 获取物料类别下拉列表
        getNutrients() {
           const url= this.urlMater + `api/bddishescategory/getdishescategory`;
            axios({method: 'post', url: url, data: this.conditionForm})
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
       
        handleSizeChange(val){
            this.conditionForm.pageSize = val;
            this.pageSize = val;
            this.pageIndex = 1;
            this.conditionForm.pageIndex = 1;
            this.getTableData();
        },
        handleCurrentChange(val){
            this.conditionForm.pageIndex = val;
            this.pageIndex = val;
            this.getTableData();
        },
        makeSure(){
             this.$message.closeAll();
            // if(!this.dishMultipleSelection.length) {
            //      this.$message({
            //         message: '请选择至少一种菜品',
            //         type: 'warn',
            //     });
            //     return false;
            // }else {
                let flag = true;
                this.changeTerpineList.every(item => {
                    if(!item.quantity) {
                        this.$message.closeAll();
                        this.$message({
                            message: '请输入选中的菜品的重量',
                            type: 'warn'
                        })
                        flag = false;
                        return false;
                    }
                })        
                if(flag) {
                    this.$emit('parentSetDishList', this.changeTerpineList);
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
