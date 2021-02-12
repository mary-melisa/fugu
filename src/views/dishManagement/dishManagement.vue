<template>
    <!-- <h3>菜品管理</h3> -->
    <div class="dishManagement">
        <Breadcrumb :firstMenu="'备餐管理'" :secondMenu="'菜品管理'" />
        <div class="search">
            <div class="fieldItem">
                <span>类别：</span>
                <el-select class="commonSelect" v-model="dishesCategoryId">
                    <el-option :value="selectDefault" label="请选择">请选择</el-option>
                    <el-option v-for="item in cla" :key="item.id" :label="item.categoryName" :value="item.id">{{item.categoryName}}</el-option>
                </el-select>
            </div>
            <div class="fieldItem">
                <span>关键字：</span>
                <el-input placeholder="请输入关键字" class="commonInput" v-model="name" > </el-input>
            </div>
            <el-button class="conditionBtn" @click.native="select">查询</el-button>
            <el-button class="conditionBtn" @click.native="educe">导出</el-button>
        </div>
        <div class="operBtns">
            <el-button  icon="el-icon-plus" @click="add()">添加</el-button>
            <el-button  icon="el-icon-delete" @click="del()">批量删除</el-button>
        </div>
        <div class="table">
            <TableContent :parentTableData="result" :claId="chaName" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:setParentSelection="setSelection" v-on:parentEdit="edit" v-on:parentDel="delSingle" v-on:parentSetPageSize="setPageSize" v-on:parentSetPageIndex="setPageIndex" :parentClass="cla"/>
        </div>
         <AddClass v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" v-on:setPageIndexDefault="setPageIndexDefault"></AddClass>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import AddClass from '@/views/dishManagement/components/addClass/addClass.vue';
import TableContent from '@/views/dishManagement/components/tableContent/tableContent.vue';

export default {
    components:{
        Breadcrumb,
        TableContent,
        AddClass
    },
    data() {
      return {
        defaultProps: {
            pageSize: 10,
            pageIndex: 1
        },
        selectDefault: -1,
        result: {},
        multipleSelection: [],
        dialogVisible: false,
        currentMeal: {},     // 当前选中菜品
        title: 1 ,          // 1 新增菜品  2编辑菜品
        cla: [],            // 菜品类别列表
        chaName: '',        //菜类的名称
        // keyword: '',
        conditionForm: {    //获取菜品类别的参数
          pageIndex: 1,
          pageSize: 100,
        },
        name: "", // 关键字
        dishesCategoryId: -1, // 菜品类别
        deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
        loading:null
      }
    },
    mounted() {
        // 初始化
        this.initData();
        
        // 获取菜品类别列表
        this.getTerpineCla();

        // 获取菜品分页列表
        this.getTableData();
    },
    methods:{
        // 初始化数据
        initData(){
          const flag = this.$route.params.flag;
         if(flag === 'add') {
           this.title = 1;
           this.dialogVisible = true;
         }
        },
        // 查询
        select(){
            this.defaultProps.pageIndex = 1;
            this.getTableData();
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        },
        // 导出
        educe(){
          let arr = [];
          const url = window.$config2 + `api/VarietyOfDishes/ExportDishes`;

          if(this.multipleSelection.length) {
              this.multipleSelection.forEach(item => {
                  arr.push(item.id);
              })
          }
          const options = {method: 'post',url: url, responseType: 'blob', data: arr};
          console.log(options);
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
                elink.download = "菜品管理.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => this.loading.close());
        },
        // 改变分页页条数
        setPageSize(size){
            this.defaultProps.pageSize = size;
            this.getTableData();
        },
        // 改变分页当前页
        setPageIndex(index){
            this.defaultProps.pageIndex = index;
            this.getTableData();
        },
        // 编辑
        edit(rowObj) {
            this.title = 2;
            this.currentMeal = rowObj;
            this.dialogVisible = true;
        },
        // 批量删除
        del(){
            if(!this.multipleSelection.length){
            this.$message({
                message: '请先选择至少一种菜品',
                type: 'warn',
            });
            }else {
            this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteFlag = 'some';
                this.deleteMeal({});
            })
            }
        },
        // 单个删除
        delSingle(rowObj) {
            this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteFlag = 'single';
                this.deleteMeal(rowObj);
            })
        },
        //删除
        deleteMeal(rowObj) {
            let arr = [];
            if(this.deleteFlag === 'some') {
                this.multipleSelection.forEach(item => {
                    arr.push(item.id)
                });
            }else {
                arr.push(rowObj.id);
            }
            const url = window.$config2 + `api/VarietyOfDishes/VarietyOfDishesDelete`;
            axios({ method: 'post', url: url, data: arr})
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.defaultProps.pageIndex = 1;
                        this.getTableData();
                    }else if(rsp.data.message){
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err =>
                    console.log(err)
                );
        },
        //选择菜类，得到菜类的名称
        claName(item){
            this.chaName = item.categoryName
        },
        // 获取菜品类别
        getTerpineCla(){
            const url = window.$config1 +  `api/bddishescategory/getdishescategory`;
            axios({method: 'post', url: url, data: this.conditionForm})
            .then( res => {
                this.cla = res.data.result
            })
        },
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)    
        },
        setPageIndexDefault(val){
            this.defaultProps.pageIndex = val;
        },
        // 菜品分页查询
        getTableData() {
            const url = window.$config2 +`api/VarietyOfDishes/GetVarietyOfDishesPageList`;
            console.log(this.name, this.dishesCategoryId)
            if(this.name != ""){
                this.defaultProps.name = this.name;
            }
            if(this.dishesCategoryId != -1) {
                this.defaultProps.dishesCategoryId = this.dishesCategoryId;
            }
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios({ method: 'post', url: url, data: this.defaultProps})
                .then(rsp => {
                    this.loading.close();
                    if (rsp.data.status == 1) {
                        // let rows = rsp.data.result;
                        //  let obj1 = rsp.data;
                        //  if(rows.length) {
                        //      rows.forEach(item => {
                        //          obj1.result.push(JSON.parse(JSON.stringify(item)));
                        //      })
                        //      this.result = JSON.parse(JSON.stringify(obj1));
                        //  }
                        // // this.result = JSON.parse(JSON.stringify(rsp.data));
                        // let obj = {};
                        // Object.keys(this.defaultProps).forEach(key => {
                        //     if(key === 'pageSize' || key === 'pageIndex') {
                        //         obj[key] = this.defaultProps[key];
                        //     }
                        // })
                        // this.defaultProps = obj;
                        // this.result = JSON.parse(JSON.stringify(rsp.data));
                        this.result = rsp.data;
                    } else{
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
            .catch(err => this.loading.close());
        },
        // 新增
        add() {
            this.title = 1;
            this.dialogVisible = true;
        },
        // 关闭模态框回调
        cancelModule(val) {
            this.dialogVisible = val;
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
    .operBtns{
        margin-left: 20px;
        border-bottom: 0;
    }
    .table{
        width: 100%;
        height: calc(100% - 240px);
    }
}
</style>
