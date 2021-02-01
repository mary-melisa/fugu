<template>
    <div class="userManagement">
        <Breadcrumb :firstMenu="'系统管理'" :secondMenu="'用户管理'"/>
        <!-- <el-row class="topsearch">
            <el-col :span="18">
                <el-row>
                    <el-col :span="7">
                    <span style="font-size:16px ">姓名: </span>
                    <el-input placeholder="请输入姓名" v-model="defaultProps.name" style="width: 150px;"> </el-input>
                    </el-col>
                    <el-col :span="10">
                    <span style="font-size:16px ">所属角色: </span>
                        <el-select  v-model="defaultProps.role" placeholder="请选择">
                            <el-option
                            v-for="item in optionsList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6">
              <el-button class="conditionBtn" @click="getTableData" >查询</el-button>
              <el-button class="conditionBtn" @click="add">导出</el-button>
            </el-col>
        </el-row> -->
        <div class="search">
            <div class="fieldItem">
                <span>用户名：</span>
                <el-input placeholder="请输入用户名" v-model="name" class="commonInput"> </el-input>
            </div>
            <div class="fieldItem">
                <span>所属角色：</span>
                <el-select class="commonSelect"  v-model="roleId" placeholder="请选择">
                    <el-option :value="defaultSelect" label="请选择">请选择</el-option>
                    <el-option
                    v-for="item in optionsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <el-button class="conditionBtn" @click="getTableData">查询</el-button>
            <el-button class="conditionBtn" @click="educe">导出</el-button> 
        </div>
        <el-row :span="24" class="operBtns">
            <el-button  icon="el-icon-plus" @click="add">添加</el-button>
            <el-button  icon="el-icon-delete" @click="del">批量删除</el-button>
        </el-row>
        <div class="table">
          <TableContent :parentTableData="result" :parentDefault="defaultProps" v-on:setCurrentMeal="selectMeal" v-on:parentEdit="edit" v-on:parentDel="delsingle" v-on:setParentSelection="setSelection" v-on:parentHandleSizeChange="handleSizeChange" v-on:parentHandleCurrentChange="handleCurrentChange"/>
        </div>
        <AddUserman v-on:cancelModule="cancelModule" v-if="dialogVisible" v-on:getParentTableData="getTableData" :parentTitle="title" :parentCurrentMeal="currentMeal" :parentOptionsList="optionsList"></AddUserman>
    </div>
</template>

<script>
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import axios from "axios";
import TableContent from '@/views/userManagement/components/tableContent/tableContent.vue';
import AddUserman from '@/views/userManagement/components/addUserman/addUserman.vue';
export default {
    components:{
        Breadcrumb,
        TableContent,
        AddUserman
    },
    data(){
        return{
            defaultSelect: -1,
            name: '',
            roleId: this.defaultSelect,
            defaultProps:{
                pageSize: 10,
                pageIndex: 1
            },
            addMeal:{
                name:'',
                mobile:'',

            },
            optionsList: [],
            dialogFormVisible:false,
            result: {},
            multipleSelection: [],
            dialogVisible: false,
            currentMeal: {}, // 当前选中数据
            title: 1, // 1 新增  2编辑
            deleteFlag: 'some' // 'some'批量删除   'single' 单个删除
        }
    },
    mounted(){
        this.getroles();
        this.getTableData();
    },
    methods:{
        setSelection(arr){
            this.multipleSelection = arr;
            console.log(arr)
        },
        // 导出
        educe(){
            let arr = [];
            const url = window.$config + `api/User/ExportUser`;
            if(this.multipleSelection.length) {
                this.multipleSelection.forEach(item => {
                    arr.push(item.id);
                })
            }
          let optionsObj = {method: 'post', url: url, data: arr, responseType: 'blob'};
          axios(optionsObj)
            .then(rsp=>{
                let elink = document.createElement('a');
                elink.download = "用户信息.xlsx";
                elink.style.display = 'none';
                var blob = new Blob([rsp.data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            })
            .catch(err => console.log(err));
        },
       //获取角色列表
        getroles(){
            var config = {
                method: 'post',
                url: window.$config+'api/Roles/GetRolePageList',
                data : this.defaultProps
            };
            axios(config)
            .then(rsp => {
                if(rsp.data.status == 1){
                    this.optionsList = rsp.data.result;
                    console.log(this.optionsList)
                } else {
                    console.log("获取失败")
                }
            })
            .catch(err=> console.log(err));
        },
        //获取表格数据
        getTableData(){
            let obj = {};
            obj.pageSize = this.defaultProps.pageSize;
            obj.pageIndex = this.defaultProps.pageIndex;
            if(this.name) {
                obj.name = this.name;
            }
            if(this.roleId !== this.defaultSelect) {
                obj.roleId = this.roleId;
            }
            const url = window.$config+`api/User/GetUserPageList`;
            axios({method: 'post',url: url,data: obj})
            .then(rsp=>{
                if (rsp.data.status == 1) {
                    this.result = rsp.data;
                  
                } else{
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
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
      //绑定手环
        bind(){
           this.dialogFormVisible = true
        },

      // 批量删除
      del(){
        if(!this.multipleSelection.length){
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
            this.deleteFlag = 'some';
            this.deleteMeal();
          })
        }
      },
      //单个删除
      delsingle(rowObj){
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
        const url = window.$config+`api/User/UserDetel`;
        axios({ method: 'post', url: url,data:arr})
            .then(rsp => {
                if (rsp.data.status == 1) {
                   this.getTableData();
                   this.$message({
                        message: '删除成功！',
                        type: 'success',
                    });
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
      cancelModule(val) {
          this.dialogVisible = false;
      },
      // 当前选中餐别
      selectMeal(meal){
        this.currentMeal = meal;
        console.log(meal);
      }
    }
    
}
</script>

<style lang="scss" scoped>
    ::v-deep.commonDialog{  
        .el-dialog{
            min-height: 200px;
            .el-dialog__body{
                min-height: 100px;
                padding:10px 8px;
                .mt45{
                    margin-top: 27px;
                }
            }
            .commonButton{
                color: #ffffff;
            }
        }
    }
    .userManagement {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .model{
       width: 100%;
    }
    .table{
        width: 100%;
        height: calc(100% - 203px);
    }
    .operBtns{
        border-bottom: 0;
        border-top: 1px solid #cccccc;
    }
    .topsearch{
        margin-bottom: 20px;
    }
}
</style>