<template>
    <div class="memberData">
        <Breadcrumb :firstMenu="'会员管理'" :secondMenu="'会员数据'"/>
        <div class="search">
            <!-- <div class="fieldItem">
              <span>手机号：</span>
              <el-input placeholder="请输入手机号" class="commonInput" v-model="mobile" style="width: 200px;"> </el-input>
            </div>
            <div class="fieldItem">
              <span class="ml10">姓名：</span>
              <el-input placeholder="请输入姓名" class="commonInput" v-model="userName" style="width: 200px;"> </el-input>
            </div> -->
            <div class="fieldItem">
              <!-- <span class="ml10">关键字：</span> -->
              <el-input placeholder="请输入工号/姓名/身份证号/手机号" class="commonInput" v-model="keyContent" style="width: 300px;"> </el-input>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button>
            <el-button class="conditionBtn" @click="importExcel">导入</el-button>
        </div>
        <div class="operBtns">
            <el-button  icon="el-icon-plus" @click="add">添加</el-button>
            <el-button  icon="el-icon-delete" @click="delSome">批量删除</el-button>
        </div>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:parentEdit="edit" v-on:parentDel="del" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange" v-on:changeFace="changeFace"/>
        </div>
        <AddMem v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" v-on:setPageIndex="setPageIndex"></AddMem>
        <ExportModule v-if="exportVisible" v-on:getTableData="getTableData" v-on:parentClo="close" :restaurantObj="restaurantObj"></ExportModule>
        <ChangeFace v-if="faceFlag" v-on:getParentTableData="getTableData" v-on:cancelModule="cancelModule" :parentCurrentMeal="currentMeal" :restaurantObj="restaurantObj"/>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/memberData/components/tableContent/tableContent.vue';
import AddMem from '@/views/memberData/components/addMem/addMem.vue';
import ExportModule from '@/views/memberData/components/exportModule/exportModule.vue';
import ChangeFace from '@/views/memberData/components/changeFace/changeFace.vue';

export default {
    components:{
        Breadcrumb,
        TableContent,
        AddMem,
        ExportModule,
        ChangeFace
    },
    data(){
        return{
            urlPrev: window.$moneyUrl,
            defaultProps:{
                pageSize: 10,
                pageIndex: 1
            },
            mobile:'',
            userName:'',
            keyContent:'',
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
            restaurantObj: {},  // 食堂对象
            loading:null,
            dialogVisible: false,
            exportVisible: false,
            faceFlag: false,
        }
    },
    computed: {
        cateenInfo() {
            return this.$store.state.Account.cateenInfo
        }
    },
    mounted(){
        // 初始化用户信息
        this.initUserInfo();
        // 查询表格信息
        this.getTableData();
    },
    methods:{
      setSelection(arr){
        this.multipleSelection = arr;
        console.log(arr)
      },
      initUserInfo(){
          const user = localStorage.getItem("userInfo"); 
          if(user) {
            this.userId = JSON.parse(user).userId;
          }
          this.restaurantObj = this.cateenInfo;
          console.log(this.restaurantObj);
       },
       // 导入
       importExcel(){
         this.exportVisible = true;
       },
       // 关闭导入弹窗
       close(){
         this.exportVisible = false;
       },
        //获取表格数据
        getTableData(){
          let obj = {};
          obj.pageIndex = this.defaultProps.pageIndex;
          obj.pageSize = this.defaultProps.pageSize;
          if(this.keyContent) {
            obj.keyContent = this.keyContent;
          }
          if(this.restaurantObj.id){
            obj.restaurantId = this.restaurantObj.id;
          }
            const url = this.urlPrev + `api/member/getmember`;
            this.loading = this.$loading({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                this.loading.close();
                if (rsp.data.status == 1) {
                    this.result = JSON.parse(JSON.stringify(rsp.data));
                    console.log(this.result);
                } else if(rsp.data.message){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err =>this.loading.close());
        },
        // 导出
        educe(){
          let arr = [];
          let str = "";
          let url = window.$moneyUrl + `api/member/exportmember`;
          if(this.multipleSelection.length) {
            this.multipleSelection.forEach(item => {
              arr.push(item.id);
              })
            str = arr.join(',');
            url = window.$moneyUrl + `api/member/exportmember?ids=` + str;
          }
         
          this.loading = this.$loading({
                lock: true,
                text: '导出中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
          });
          axios({method: 'post',url: url, responseType: 'blob'})
            .then(rsp=>{
                this.loading.close();
                let elink = document.createElement('a');
                elink.download = "会员数据.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => this.loading.close());
        },
        setPageIndex(val) {
          this.defaultProps.pageIndex = val;
        },
        handleSizeChange(val) {
          //console.log(`每页 ${val} 条`);
          this.defaultProps.pageSize = val;
          this.defaultProps.pageIndex = 1;
          this.getTableData();
        },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.defaultProps.pageIndex = val;
        this.getTableData();
      },
        // 新增
      add() {
          this.title = 1;
          this.dialogVisible = true;
      },
      //编辑
      edit(rowObj) {
         this.title = 2;
         this.currentMeal = rowObj;
         this.dialogVisible = true;
      },
      // 批量删除
      delSome(rowObj){
        this.deleteFlag = 'some';
        if(!this.multipleSelection.length){
          this.$message.closeAll();
          this.$message({
              message: '请先选择一条数据',
              type: 'warn',
          });
        }else {
          this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteMeal();
          })
        }
      },
      //单个删除
      del(rowObj){
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
        const url = this.urlPrev+`api/member/delmember?ids=`+arr;
        axios({ method: 'post', url: url})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.$message({
                        message: '删除成功！',
                        type: 'success',
                    });
                   this.defaultProps.pageIndex = 1;
                   this.getTableData();
                }else if(rsp.data.status == 0){
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
      },
      // 关闭模态框回调
      cancelModule() {
          this.dialogVisible = false;
          this.faceFlag = false;
      },
      // 当前选中餐别
      selectMeal(meal){
        this.currentMeal = meal;
        console.log(meal);
      },
      changeFace(row){
         this.currentMeal = row;
         this.faceFlag = true;
      }
    },
    watch: {
      cateenInfo: {
        handler(newValue){
            this.restaurantObj = newValue;
            this.getTableData();
        },
        deep: true
      }
    }
}
</script>

<style lang="scss" scoped>
    .memberData{
        width: 100%;
        height: 100%;
        @include flex();
        flex-direction: column;
        .model{
        width: 100%;
        }
    }
    .searchinput{
        display: flex;
        text-align:justify;
        justify-content:space-between
    }
    .allinput{
        display: flex;
    }
    .input{
        font-size: 16px;
        margin-right: 10px;
    }
    .operBtns{
        border-bottom: 0;
        border-top: 1px solid #cccccc;
    }
    .topsearch{
        margin-bottom: 20px;
    }
    .table{
        width: 100%;
        height: calc(100% - 203px);
    }
</style>