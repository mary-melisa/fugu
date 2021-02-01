<template>
    <!-- <h3>套餐管理</h3> -->
    <div class="dishManagement">
         <Breadcrumb :firstMenu="'备餐管理'" :secondMenu="'套餐管理'" />
         <div class="search">
            <div class="fieldItem">
                <span>类别：</span>
                <el-select class="commonSelect" v-model="dishesCategoryId">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in cla" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
                </el-select>
            </div>
            <div class="fieldItem">
                <span>套餐名称：</span>
                <el-input placeholder="请输入套餐名称" class="commonInput" v-model="name" style="width: 200px;"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button> 
        </div>
        <div  class="operBtns">
            <el-button  icon="el-icon-plus" @click="add">添加</el-button>
            <el-button  icon="el-icon-delete" @click="deleteMeal()">批量删除</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="resultObj" :claId="chaName" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentDel="setIds" v-on:setSelectIds="setSelectIds" v-on:parentEdit="edit" v-on:setPageSize="setPageSize" v-on:setPageIndex="setPageIndex" v-on:setVisible="setVisible"/>
        </div>
         <AddPackages v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal"></AddPackages>
         <!-- 营养成分弹窗 -->
        <el-dialog align="center" class="nutrDialog" width="250px" :title="topTitle" :visible.sync="visible" :close-on-click-modal="false" >
            <div class="nutrAll">
                <div class="title">营养成分</div>
                <el-row class="nutr"><el-col :span="10">热量:  </el-col><el-col :span="14">{{ nutrientInfo.heat }}</el-col></el-row>
                <el-row class="nutr"><el-col :span="10">脂肪:  </el-col><el-col :span="14">{{ nutrientInfo.fat }}</el-col></el-row>
                <el-row class="nutr"><el-col :span="10">蛋白质:  </el-col><el-col :span="14">{{ nutrientInfo.protein }}</el-col></el-row>
                <el-row class="nutr"><el-col :span="10">碳水化合物:  </el-col><el-col :span="14">{{ nutrientInfo.carbohydrates }}</el-col></el-row>
                <el-row class="nutr"><el-col :span="10">膳食纤维:  </el-col><el-col :span="14">{{ nutrientInfo.dietaryFiber }}</el-col></el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import AddPackages from '@/views/packageManagement/components/addPackages/addPackages';
import TableContent from '@/views/packageManagement/components/tableContent/tableContent.vue';

export default {
    components:{
        Breadcrumb,
        TableContent,
        AddPackages
    },
    data() {
      return {
        topTitle : '',
        visible: false,
        selectDefault: -1,
        urlCla: window.$config1,
        urlPrev: window.$config2,
        defaultProps: {
            pageSize: 10,
            pageIndex: 1 //输入的关键字
        },
        Ids:[],
        resultObj: {},
        multipleSelection: [],
        dialogVisible: false,
        currentMeal: {},     // 当前选中餐别
        title: 1 ,          // 1 新增餐别  2编辑餐别
        cla: [],
        dishesCategoryId: this.selectDefault,              //菜类的编号
        name:'',
        chaName: '',        //菜类的名称
        // keyword: '',
        conditionForm: {    //获取菜品类别的参数
          pageIndex: 1,
          pageSize: 10000
        },
        nutrientInfo: {}, // 营养分析数据对象
        loading:null
      }
    },
    mounted() {
        // 初始化
        this.initData();
        this.getTerpineCla();
        this.getTableData();
    },
    methods:{
        // 营养成分弹窗
        setVisible(row){
            // this.currentMeal = rowObj;
            
            // this.topTitle = row.setMealName
            const url = window.$config2+`api/SetMealManagement/GetNutrients?nSetMealId=`+row.id;
            axios({ method: 'post', url: url })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        if(rsp.data.result && rsp.data.result.length) {
                            this.nutrientInfo = rsp.data.result[0];
                        }
                        this.visible = true;
                    } else{
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => console.log(err));
        },
        // 初始化数据
        initData(){
          const flag = this.$route.params.flag;
         if(flag === 'add') {
           this.title = 1;
           this.dialogVisible = true;
         }
        },
        // 编辑
        edit(rowObj) {
            this.title = 2;
            this.currentMeal = rowObj;
            this.dialogVisible = true;
        },
        setIds(rowObj)
        {
            this.Ids=rowObj;
            this.deleteMeal();
        },
        setSelectIds(rowObj)
        {
            this.Ids=rowObj;
        },
        //删除
        deleteMeal() {
           if (!this.Ids.length) {
               this.$message.closeAll();
               this.$message({
                message: '请选择数据',
                type: 'warn',
              });
          }
            this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
        const url = window.$config2+`api/SetMealManagement/VarietyOfDishesDelete`;
        axios({ method: 'post', url: url,data:this.Ids})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                        this.getTableData();
                }else if(rsp.data.status == 0){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
           
            
          })
        },
        // 导出
        educe(){
          let arr = [];
          const url = window.$config2 + `api/SetMealManagement/ExportSetMeal`;

          if(this.multipleSelection.length) {
              this.multipleSelection.forEach(item => {
                  arr.push(item.id);
              })
          }
          const options = {method: 'post',url: url, responseType: 'blob', data: arr};
          this.loading = this.$loading({
                lock: true,
                text: '导出中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
          });
          axios(options)
            .then(rsp=>{
                this.loading.close();
                let elink = document.createElement('a');
                elink.download = "套餐管理.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => 
                this.loading.close()
            );
        },
        //选择菜类，得到菜类的名称
        claName(item){
            this.chaName = item.categoryName
        },
        // 获取菜品类别
        getTerpineCla(){
            const url=this.urlCla +  `api/bddishescategory/getdishescategory`;
            axios({method: 'post', url: url, data: this.conditionForm})
            .then( res => {
                this.cla = res.data.result
            })
        },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
        //获取套餐表格数据
        getTableData() {
            const url = this.urlPrev+`api/SetMealManagement/GetSetMealManagementPageList`;
            const obj = {};
            obj.pageSize = this.defaultProps.pageSize;
            obj.pageIndex = this.defaultProps.pageIndex;
            if(this.name) {
                obj.name = this.name;
            }
            if(this.dishesCategoryId != -1) {
                obj.dishesCategoryId = this.dishesCategoryId;
            }
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios({ method: 'post', url: url, data: obj})
                .then(rsp => {
                    this.loading.close();
                    if (rsp.data.status == 1) {
                        this.resultObj = rsp.data;
                    } else{
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => 
                this.loading.close()
            );
        },
        setPageSize(val) {
            this.defaultProps.pageSize = val;
            this.defaultProps.pageIndex = 1;
            this.getTableData();
        },
        setPageIndex(val) {
            this.defaultProps.pageIndex = val;
            this.getTableData();
        },
        // 新增
        add() {
            this.title = 1;
            this.dialogVisible = true;
        },
        // 关闭模态框回调
        cancelModule(val) {
            this.dialogVisible = false;
        },
        // 当前选中菜品
        selectMeal(meal){
            this.currentMeal = meal;
            console.log(meal);
       }
    }
}
</script>

<style lang='scss' scoped>
.dishManagement{
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    // .search {
    //     margin-top: 20px;
    //     border-bottom: 0;
    // }
    .operBtns{
        margin-left: 20px;
        border-bottom: 0;
    }
    .table{
        width: 100%;
        height: calc(100% - 240px);
    }
}
::v-deep.nutrDialog {
    .el-dialog {
        margin-top: 0 !important;
        @include position(fixed, 50%, auto, auto, 50%);
        transform: translate(-50%, -50%);
    }
    .nutrAll {
        @include flex();
        flex-direction: column;
        .title {
            width: calc(100% - 40px);
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            font-size: 15px;
            color: black;
            text-align: center;
        }
        .el-row.nutr {
            width: 100%;
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
            font-size: 13px;
            color: black;
            .el-col:first-child{
                text-align: right;
            }
        }

    }
}
</style>