<template>
    <div class="reservationManage">
        <Breadcrumb :firstMenu="'订餐管理'" :secondMenu="'预定数据'" />
        <div class="search">
          <el-button class="conditionBtn"  @click="See()" >原料返算</el-button>
        </div>
        <div class="tableContent">
          <div class="timebal">
                <el-tabs class="tabs" v-model="manage.nDate" @tab-click="handleClick">
                  <el-tab-pane
                    :key="item"
                    v-for="item in editableTabs"
                    :label="item"
                    :name="item"
                  >
                  <Tabs/>
                </el-tab-pane>
                </el-tabs>
          </div>
            <div class="pagination">
                    <el-pagination
                        :handleSizeChange="defaultProps.pageSize"
                        :handleCurrentChange="defaultProps.pageIndex"
                        :current-page="defaultProps.pageIndex"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="defaultProps.pageSize"
                        
                        layout="total, sizes, prev, pager, next, jumper"
                        >
                    </el-pagination>
            </div>
        </div>
          <AddRev v-if="dialogTableVisible" v-on:parentClo="clo" :parentDate="manage.nDate"></AddRev>
   </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Breadcrumb from "@/components/breadCrumb/breadCrumb.vue";
import AddRev from './components/addRev/addRev.vue';
import Tabs from './components/tabs/tabs.vue';
export default {
  components:{
        Breadcrumb,
        AddRev,
        Tabs
    },
  data() {
    return {
      defaultProps: {
                pageSize: 10,
                pageIndex: 1,
                restaurantId: '1',
      },
      manage:{
          nDate:'',
          restaurantId:1
      },
      editableTabs:[],
      tableData:[],
      dialogTableVisible :false
    };
  },
  mounted() {
    this.manage.nDate=this.formatDateTime(moment(new Date()));
    console.log(this.manage.nDate);
    this.getData();
    this.initFormData();
  },
  methods: {
    //时间
        initFormData(){
          let arr = [];
          let that = this;
          for(let i = 0; i <=6; i++){
            arr[i] = this.formatDateTime(moment(new Date()).add(i, 'days'));
          }
          this.editableTabs = arr;
        },
      // 格式化时间
        formatDateTime(cellValue) {
            return moment(cellValue).format('YYYY/MM/DD');
        },
       //选中当前tab
      handleClick(tab,event){
        console.log("1111111111111",tab.label);
        this.manage.nDate = tab.label;
      },
    See(){
        this.dialogTableVisible=true;
      },
    clo(){
      this.dialogTableVisible=false;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        //每三行，合并两行
        if ((rowIndex + 1) % 3 === 1) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else if ((rowIndex + 1) % 3 === 0) {
          //每三行合并三列
          return [1, 3];
        }
      }
    },
    getData() {
      axios({
        url: window.$config2+'api/DishesPlan/GetReserveByDate',
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
          this.tableData = val.data.result;
        })
        .catch(err => {
          throw err;
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.reservationManage{
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .search{
       .conditionBtn {
         margin-left: 0;
       }
    }
    .tableContent {
      margin-top: 10px;
       width: 100%;
       height: 100%;
   }
    ::v-deep.timebal{
      height: calc(100% - 80px);
      .tabs{
        width: 100%;
        height: 100%;
        .el-tabs__nav-wrap::after {
          background-color: transparent;
        }
        .el-tabs__content {
          height: calc(100% - 45px);
          .el-tab-pane {
            height: calc(100% - 45px);
          }
        }
      }
      .border{
        margin-right: 25px;
      }
    }
    .operBtns{
        margin-left: 20px;
    }
    .table{
        width: 100%;
        height: calc(100% - 203px);
    }
  //   .tableContent {
  //     margin-top: 20px;
  //      width: 100%;
  //      height: 100%;
  //      .content {
  //          padding-top: 40px;
  //          height: calc(100% - 40px);
  //      }
  //  }
}
</style>
