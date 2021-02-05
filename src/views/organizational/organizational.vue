<!-- 组织架构 -->
<template>
    <div class="organizational">
        <BreadCrumb :firstMenu="'系统管理'" :secondMenu="'组织架构'"></BreadCrumb>
        <el-row  class="operBtns">
            <el-button  icon="el-icon-plus" @click="addOrgnOrCant()">添加</el-button>
            <el-button  icon="el-icon-delete" @click="isorg==1 ? deleteMeal() : deleteCateen()">批量删除</el-button>
        </el-row>
        <div class="organizationlContent">
            <div class="organizationalLeft">
                <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick"  ref="tree"></el-tree>
            </div>
            <div class="organizationalRight">
                <CanteenTable v-on:setFlag="selectFlag" :parentTableData="tableData" :parentTableData1="tableData1" :parentActiveName="activeName" :parentTableNo="tableNo" :parentDefaultPages="defaultPages" v-on:parentAdd="add" v-on:parentSelect="selectCurrent" v-on:parentSetPageSize="handleSizeChange" v-on:parentSetPageIndex="handleCurrentChange" v-on:parentDel="setOrgIds" v-on:parentOrgDels="parentOrgDels" v-on:parentCateeDels="parentCateeDels" v-on:parentDel1="setCateenIds" v-on:setIsOrg="setIsOrg" v-on:setCurrentOrgan="selectOrgan" v-on:setCurrentCanteen="selectCanteen" v-on:changeActive="selectActive" :cateenDefaultPages="cateenDefaultPages" :isorg="isorg" v-on:changeCateenPageSize="changeCateenPageSize" v-on:changeCateenPageIndex="changeCateenPageIndex"></CanteenTable>
            </div>
        </div>
        <AddOrganizational v-on:cancelModule="cancelModule" :parentActiveName="activeName" v-on:setActive="selectActive" v-if="dialogVisible" :parentFlag="flag" :parentCurrentOrgan="parentCurrentOrgan" :parentCurrentCateen="parentCurrentCateen" :treeNode="treeNode" v-on:getMenus="getMenus" v-on:getOrganizationPageList="getOrganizationPageList" v-on:getCanteens="getCanteens" :getCanteensData="getCanteensData" :defaultPages="defaultPages" :isorg="isorg" v-on:setPageIndexDefault="setPageIndexDefault"  v-on:changeCateenPageSize="changeCateenPageSize" v-on:changeCateenPageIndex="changeCateenPageIndex"></AddOrganizational>
    </div>
</template>

<script>
import axios from 'axios';
import BreadCrumb from '@/components/breadCrumb/breadCrumb.vue';
import CanteenTable from '@/views/organizational/components/canteenTable/canteenTable.vue';
import AddOrganizational from '@/views/organizational/components/addOrganizational/addOrganizational.vue';
import { RsaMixin } from '@/mixin/RsaMixin.js';
export default {
    mixins:[RsaMixin],
    components: {
        CanteenTable,
        AddOrganizational,
        BreadCrumb
    },
    data() {
        return {
            addFlag: false, // 点击“添加”按钮之前是否选中组织或食堂标志
            currentPage: 1,
            treeNode:{},
            orgIds:[],
            cateenIds:[],
            menus: [],
            getCanteensData:{},
            //是否组织 1-组织 0-食堂
            isorg:1,
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            parentCurrentOrgan:{},//当前选中组织
            parentCurrentCateen:{},//当前选中食堂
            flag:1,//1:添加 2:编辑
            defaultPages: {
                pageSize: 10,
                pageIndex: 1,
            },
            cateenDefaultPages: {
                pageSize: 10,
                pageIndex: 1,
            },
            tableData: [],
            tableData1:[],
            tableNo: 1, // 1代表组织机构   2代表食堂
            deleteFlag: 'some', // 'some'批量删除   'single' 单个删除
            dialogVisible: false,
            activeName: 'first',
            multipleSelection: []
        };
    },
    mounted() {
        this.getMenus();
        // this.init();
    },
     methods: {
        
        //其他逻辑...

        //  init(){
        //      RsaMixin.encryptedData()
        //  },
         //传组织架构列表接口
        //  getOrganizationPageList(data){
        //      this.$emit('getOrganizationPageList',data);
        //  },
        setIsOrg(rowObj)
        {
            console.log(rowObj);
            this.isorg=rowObj;
        },
        parentOrgDels(rowObj)
        {
        this.orgIds=rowObj;
        },
        parentCateeDels(rowObj)
        {
        this.cateenIds=rowObj;
        },
        // 删除组织
        setOrgIds(rowObj)
        {
            this.orgIds=rowObj;
            this.deleteMeal();
        },
        setCateenIds(rowObj)
        {
            this.cateenIds=rowObj;
            this.deleteCateen();
        },
        handleNodeClick(data) {
        console.log(this.isorg, '组织');
          this.addFlag = true;
          let tree = this.$refs.tree;
          console.log('组织架构', data);
          console.log('组织架构1', this.$refs.tree.getNode(data));
          this.treeNode=data;
          // 判断不是一级组织架构
            if(data.isorgshow===0) { 
                // this.$nextTick(() => {
                this.tableNo = 2;
                this.activeName="second";
                this.getCanteens(data);
                // });
            }else {
                this.tableNo = 1;
                this.activeName="first";
                this.getOrganizationPageList(data);
            }
      },
      //编辑组织或食堂
      selectActive(val){
          this.activeName=val;
      },
      selectFlag(val){
          this.flag=val;
      },
      //选择当前组织
      selectOrgan(obj){
          console.log("传值",obj);
          this.parentCurrentOrgan=obj;
      },
      //选择当前食堂
      selectCanteen(obj){
          this.parentCurrentCateen=obj;
      },
      // 每页显示条数
     handleSizeChange(val) {
        // if(this.tableNo === 1) {
             this.defaultPages.pageSize = val;
             this.defaultPages.pageIndex = 1;
        //  }else {
        //      this.cateenDefaultPages.pageSize = val;
        //      this.cateenDefaultPages.pageIndex = 1;
        //  }
        // 判断不是一级组织架构
          if(this.treeNode.isorgshow===0) { 
             this.getCanteens(this.treeNode);
                  this.tableNo = 2;
                  this.activeName="second";
          }else {
                this.getOrganizationPageList(this.treeNode);
                this.tableNo = 1;
                this.activeName="first";
          }
     },
    // 跳转到第几页
     handleCurrentChange(val) {
             // 判断不是一级组织架构
               if(this.treeNode.isorgshow===0) { 
                 this.tableNo = 2;
                 this.activeName="second";
                 this.defaultPages.pageIndex = val;
                 this.getCanteens(this.treeNode);
               }else {
                 this.tableNo = 1;
                 this.activeName="first";
                 this.defaultPages.pageIndex = val;
                 this.getOrganizationPageList(this.treeNode);
               }
     },
     
    //获取当前树节点和其父级节点
     getTreeNode(rspDatas){ 
            if (rspDatas) {
                rspDatas.forEach(item=>{
                if (item['children'].length>0) {
                    item['isorgshow']=1;//组织
                    this.getTreeNode(item.children); //递归
                }else{
                    item['isorgshow'] = 0;//食堂
                }
                })
            }
        },

      // 获取组织架构树
      getMenus() {
           this.menus =[];
            const url = window.$config + `api/Organization/GetOrganizationTree`;
            axios({ method: 'post', url: url })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        const rspDatas = rsp.data.result;
                        this.getTreeNode(rspDatas);
                        this.menus = rspDatas;

                        console.log(this.menus)
                        const secondMenus = [];
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
      // 获取组织架构列表
      getOrganizationPageList(data) {
          this.tableData=[];
          console.log(data);
          if(Object.keys(data).length) {
              this.defaultPages.orgId = data.id;
          } 
          if(!this.defaultPages.pageIndex){
              return false;
          }
          const url = window.$config +`api/Organization/GetOrganizationPageList`;
            axios({ method: 'post', url: url, data: this.defaultPages })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.tableData = rsp.data;
                        console.log(this.tableData, '组织架构列表');
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
      setPageIndexDefault(val){
          this.defaultPages.pageIndex = val;
      },
      // 改变食堂列表的页码
      changeCateenPageSize(val){
          this.cateenDefaultPages.pageSize = val;
          this.cateenDefaultPages.pageIndex =  1;
           // 判断不是一级组织架构
          if(this.treeNode.isorgshow===0) { 
             this.getCanteens(this.treeNode);
                  this.tableNo = 2;
                  this.activeName="second";
          }else {
                this.getOrganizationPageList(this.treeNode);
                this.tableNo = 1;
                this.activeName="first";
          }
      },
      // 改变食堂列表的当前页
      changeCateenPageIndex(val) {
          this.cateenDefaultPages.pageIndex = val;
          console.log(this.treeNode.isorgshow);
           // 判断不是一级组织架构
           if(this.treeNode.isorgshow===0) { 
                this.getCanteens(this.treeNode);
                this.tableNo = 2;
                this.activeName="second";
          }else {
                this.getOrganizationPageList(this.treeNode);
                this.tableNo = 1;
                this.activeName="first";
          }
      },
      // 获取组织架构下面的食堂列表
      getCanteens(item) {
          this.tableData1=[];
          console.log(item);
          if (item.isshitang==1) {
              console.log("11111111");
             const url = window.$config  + `api/Restaurant/GetRestaurantServicePageList`;
          const params = {
              pageSize: this.cateenDefaultPages.pageSize,
              pageIndex: this.cateenDefaultPages.pageIndex,
              id:item.id
          }
          this.getCanteensData=params;
          const that = this;
          axios({ method: 'post', url: url,data:params })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        console.log(rsp.data);
                        // 处理业务模式文字显示
                        let obj = {};
                        let arr = [];
                        if(rsp.data.result && rsp.data.result.length) {
                            obj = rsp.data;
                            arr = obj.result;
                            arr.forEach(item1=>{
                                item1["patternName"]= that.formatModule(item1.patternType);
                            });
                            obj.result = arr;
                        }
                        that.tableData1 = JSON.parse(JSON.stringify(obj));
                        // that.$nextTick(() => {
                        //     that.tableData1.result = JSON.parse(JSON.stringify(obj.result));
                        // })
                        // this.$forceUpdate()
                        console.log(that.tableData1);
                    } else if(rsp.data.message){
                        this.$message.closeAll();
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
         }else{
             item.children=[];
            const url = window.$config  + `api/Restaurant/GetRestaurantServicePageList`;
            let params = {};
          console.log(item);
          console.log(params);
            if(item.id) {
                params.orgId =  item.id;
                
            }else if(item.orgId) {
                params.orgId = item.orgId;
            }
            params.pageIndex = this.cateenDefaultPages.pageIndex;
            params.pageSize = this.cateenDefaultPages.pageSize;
          const that = this;
          this.getCanteensData=params;
            axios({ method: 'post', url: url, data: params })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        var chil={};
                        let obj = {};
                        let arr = [];
                        if(rsp.data.result && rsp.data.result.length) {
                            obj = rsp.data;
                            arr = obj.result;
                            arr.forEach(item1=>{
                                item1["patternName"]= that.formatModule(item1.patternType);
                                chil={name:item1.restaurantName,id:item1.id,isorgshow:0,isshitang:1};
                                item.children.push(chil);
                            });
                            obj.result = arr;
                        }
                        // that.tableData1 = obj;
                        that.tableData1 = JSON.parse(JSON.stringify(obj));
                        item["isshitang"]=0;
                        // that.$nextTick(() => {
                        //     that.tableData1.result = JSON.parse(JSON.stringify(obj.result));
                        // })
                        // this.$forceUpdate()
                        console.log(that.tableData1);
                        console.log(item);
                        console.log(that.tableData1, this.menus);
                    } else if(rsp.data.message){
                        this.$message.closeAll();
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
          }
    
      },
      // 根据组织获取食堂列表
    //   getCanteenByOrgId(data) {
    //        const url = window.$config + `api/Restaurant/GetRestaurantServiceListByOrgId?OrgId=`+data.id;
    //         axios({ method: 'post', url: url })
    //             .then(rsp => {
    //                 if (rsp.data.status == 1) {
    //                     const rspDatas = rsp.data.result;
    //                     if(rspDatas.length) {
    //                         rspDatas.forEach(item => {
    //                             item['isCanteen'] = true;
    //                         });
    //                         data.children = rspDatas;
    //                     }
    //                 } else {
    //                     this.$message({
    //                         message: rsp.data.message,
    //                         type: 'error',
    //                     });
    //                 }
    //             })
    //             .catch(err => console.log(err));
    //   },
     //格式化业务模式
     formatModule(value) {
         if(value == 1) {
             return 'AI智能模式';
         }else if(value === 2) {
             return 'RFID智盘';
         }else if(value === 3) {
             return '人脸识别自助';
         }
         return "";
     },
       //删除食堂
      deleteCateen() {
          if (!this.cateenIds.length) {
              this.$message.closeAll();
               this.$message({
                message: '请选择食堂',
                type: 'warn',
              });
          }
        this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
        const url = window.$config+`api/Restaurant/RestaurantServiceDetel`;
        axios({ method: 'post', url: url,data:this.cateenIds})
            .then(rsp => {
                if (rsp.data.status == 1) {
                     this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                   // 判断不是一级组织架构
                    if(this.treeNode.isorgshow===0) { 
                        this.defaultPages.pageIndex = 1;
                        this.getCanteens(this.getCanteensData);
                        this.tableNo = 2;
                        this.activeName="second";
                    }else {
                        this.defaultPages.pageIndex = 1;
                        this.getOrganizationPageList(this.getCanteensData);
                        this.tableNo = 1;
                        this.activeName="first";
                    }
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
       //删除组织确认
      deleteMeal() {
        if (!this.orgIds.length) {
            this.$message.closeAll();
            this.$message({
                message: '请选择组织',
                type: 'warn',
            });
            return false;
        }
            // console.log(this.orgIds);
            // const rowId = this.orgIds[0];
            // if(this.treeNode.children.length) {
            //     let curObj = this.treeNode.children.find(item => item.id === rowId);
            //     if(Object.keys(curObj).length && curObj.children) {
            //          this.$message.closeAll();
            //          this.$confirm('该组织架构下有下属组织或食堂，确定删除该组织架构吗?', '提示', {
            //              confirmButtonText: '确定',
            //              cancelButtonText: '取消',
            //              type: 'warning'
            //          }).then(() => {
            //              this.deleteOrign();
            //          })
            //     }
            // }else {
                console.log(this.orgIds);
                this.$confirm('删除后不可恢复，确认删除选中的数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteOrign();
                });
            // }
      },
      // 删除组织
      deleteOrign(){
        const that = this;
        const url = window.$config+`api/Organization/OrganizationDetel`;
        axios({ method: 'post', url: url,data:this.orgIds})
            .then(rsp => {
                if (rsp.data.status == 1) {
                    this.$message.closeAll();
                    this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                        this.defaultPages.pageIndex = 1;
                        this.getMenus();
                        this.getOrganizationPageList(this.treeNode);
                }else if(rsp.data.message){
                    this.$message.closeAll();
                    this.$message({
                        message: rsp.data.message,
                        type: 'error',
                    });
                }
            })
            .catch(err => console.log(err));
      },
      // 批量选择
      selectCurrent(list) {
          this.multipleSelection = list;
      },
      // 点击添加按钮
      addOrgnOrCant(){
          console.log(this.addFlag)
          if(this.addFlag) {
              this.selectFlag(1);
              this.add();
          }else {
              this.$message.closeAll();
              this.$message({
                  message: '请先选择组织或者食堂',
                  type: 'warn'
              })
          }
      },
      // 新增
      add() {
          this.dialogVisible = true;
      },
       // 关闭模态框回调
        cancelModule(val) {
            this.dialogVisible = false;
        },
       
    
    }
}
</script>

<style scoped lang="scss">
.organizational {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;
    .organizationlContent {
        width: 100%;
        height: calc(100% - 135px);
        @include flex();
        .organizationalLeft {
            width: 215px;
            height: 100%;
            background: white;
            overflow-y: auto;
            .el-tree {
                padding-top: 15px;
            }
        }
        .organizationalRight {
            flex: 1;
            max-width: calc(100% - 215px);
            padding-top: 15px;
        }
    }
}
</style>
