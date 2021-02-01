<!-- 设备管理 -->
<template>
    <div class="home">
      <div class="header">
          <div class="headerLogo">
              <img alt="logo" src="@/assets/images/logo.png" />
              <span>{{ title }}</span>
          </div>
          <div class="headerUser">
              <div class="headerBadge">
                  <el-badge :value="25" class="item">
                      <i class="el-icon-edit"></i>
                  </el-badge>
              </div>
              <span class="headerUserText">所属餐厅：</span>
              <el-select v-model="restaurantObj" placeholder="请选择" value-key="id" @change="changeCateen">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                    {{ item.name }}
                    </el-option>
            </el-select>
  
              <span class="headerUserName">{{ user.name }}</span>
              <el-avatar :size="40">
                  <i class="el-icon-user"></i>
              </el-avatar>
              <i class="headerUserRole">{{ user.role }}</i>
              <i class="el-icon-switch-button" @click="signOut()"></i>
          </div>
      </div>
      <div class="mainBox">
          <div class="sider">
              <el-menu default-active="2" class="commonMenus" @open="handleOpen" @close="handleClose" background-color="#333333" text-color="#fff" active-text-color="#1890FF" unique-opened>
                  <el-submenu index="1">
                      <template slot="title">
                          <i class="el-icon-data-line"></i>
                          <span>运营数据</span>
                      </template>
                      <el-menu-item-group>
                          <!-- <router-link to="/businessData"><el-menu-item index="1-1">营业数据</el-menu-item></router-link>
                          <router-link to="/membershipData"><el-menu-item index="1-2">顾客数据</el-menu-item></router-link>
                          <router-link to="/dishData"><el-menu-item index="1-3">菜品数据</el-menu-item></router-link>
                          <router-link to="/rechargeData"><el-menu-item index="1-4">充值数据</el-menu-item></router-link> -->
                          <router-link to="/businessData"><el-menu-item index="1-1">营业数据</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="1-2">顾客数据</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="1-3">菜品数据</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="1-4">充值数据</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="1-5">机器状态</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="2">
                      <template slot="title">
                          <i class="el-icon-menu"></i>
                          <span>备餐管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/mealSetting"><el-menu-item index="2-1">餐别设置</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="2-2">菜品类别</el-menu-item></router-link>
                          <router-link to="/dishPreparation"><el-menu-item index="2-3">备菜计划</el-menu-item></router-link>
                          <router-link to="/packageManagement"><el-menu-item index="2-4">套餐管理</el-menu-item></router-link>
                          <router-link to="/dishManagement"><el-menu-item index="2-5">菜品管理</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="3">
                      <template slot="title">
                          <i class="el-icon-s-order"></i>
                          <span>订餐管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/reservationManage"><el-menu-item index="3-1">预定数据</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="3-2">存餐记录</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="3-3">取餐记录</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="3-4">订单数据</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="3-5">异常订单</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="4">
                      <template slot="title">
                          <i class="el-icon-money"></i>
                          <span>财务管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/memManagement"><el-menu-item index="4-1">账户信息</el-menu-item></router-link>
                          <router-link to="/recConsumption"><el-menu-item index="4-2">消费流水</el-menu-item></router-link>
                          <router-link to="/redRecord"><el-menu-item index="4-3">冲红记录</el-menu-item></router-link>
                          <router-link to="/rechargeRecord"><el-menu-item index="4-4">充值记录</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="4-5">消费限制</el-menu-item></router-link>
                          <router-link to="/setManagement"><el-menu-item index="4-6">结算管理</el-menu-item></router-link>
                          <!-- <router-link to="/mealCard"><el-menu-item index="3-3">餐卡管理</el-menu-item></router-link>
                          <router-link to="/orderManagement"><el-menu-item index="3-5">订单管理</el-menu-item></router-link> -->
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="5">
                      <template slot="title">
                          <i class="el-icon-user"></i>
                          <span>会员管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/building"><el-menu-item index="5-1">组织架构</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="5-2">职务维护</el-menu-item></router-link>
                          <router-link to="/memberData"><el-menu-item index="5-3">会员数据</el-menu-item></router-link>
                          <!-- <router-link to=""><el-menu-item index="3-4">消费限制</el-menu-item></router-link>
                          <router-link to="/setManagement"><el-menu-item index="3-6">结算管理</el-menu-item></router-link> -->
                          <!-- <router-link to="/mealCard"><el-menu-item index="3-3">餐卡管理</el-menu-item></router-link>
                          <router-link to="/orderManagement"><el-menu-item index="3-5">订单管理</el-menu-item></router-link> -->
                      </el-menu-item-group>
                  </el-submenu>
                   <el-submenu index="6">
                      <template slot="title">
                          <i class="el-icon-bank-card"></i>
                          <span>卡务管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/cardType"><el-menu-item index="6-1">餐卡类别</el-menu-item></router-link>
                          <router-link to="/cardMaintenance"><el-menu-item index="6-2">餐卡维护</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="6-3">餐补发放</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="6-4">餐补记录</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="6-5">补卡记录</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="6-6">退卡记录</el-menu-item></router-link>
                          <router-link to="/building"><el-menu-item index="6-7">餐补规则</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="7">
                      <template slot="title">
                          <i class="el-icon-chat-line-square"></i>
                          <span>评价管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/dishEvaluation"><el-menu-item index="7-1">菜品评价</el-menu-item></router-link>
                          <router-link to="/feedback"><el-menu-item index="7-2">意见反馈</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                   <el-submenu index="8">
                      <template slot="title">
                          <i class="el-icon-guide"></i>
                          <span>设备管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/equipmentType"><el-menu-item index="8-1">设备类型</el-menu-item></router-link>
                          <router-link to="/facility"><el-menu-item index="8-2">设备列表</el-menu-item></router-link>
                          <router-link to="/maintenanceRecord"><el-menu-item index="8-3">保养记录</el-menu-item></router-link>
                          <router-link to="/runninglog"><el-menu-item index="8-4">运行日志</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="9">
                      <template slot="title">
                          <i class="el-icon-aim"></i>
                          <span>基础数据</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/nutrients"><el-menu-item index="9-1">营养成分</el-menu-item></router-link>
                          <router-link to="/matCategory"><el-menu-item index="9-2">物料类别</el-menu-item></router-link>
                          <router-link to="/matInformation"><el-menu-item index="9-3">物料信息</el-menu-item></router-link>
                          <router-link to="/customerType"><el-menu-item index="9-4">用户类型</el-menu-item></router-link>
                          
                         
                      </el-menu-item-group>
                  </el-submenu>
                 
                  <el-submenu index="10">
                      <template slot="title">
                          <i class="el-icon-setting"></i>
                          <span>系统设置</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/organizational"><el-menu-item index="10-1">组织架构</el-menu-item></router-link>
                          <router-link to="/userManage"><el-menu-item index="10-2">角色管理</el-menu-item></router-link>
                          <router-link to="/userManagement"><el-menu-item index="10-3">用户管理</el-menu-item></router-link>
                          <router-link to="/ruleConfiguration"><el-menu-item index="10-4">规则配置</el-menu-item></router-link>
                          <!-- <router-link to="/menuManagement"><el-menu-item index="7-5">菜单管理</el-menu-item></router-link> -->
                      </el-menu-item-group>
                  </el-submenu>
              </el-menu>
          </div>
          <div class="main">
              <router-view></router-view>
          </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from "vuex";
import facility from "@/views/facility/facility.vue";
export default {
    components:{
      facility,
    },
    data() {
       
        return {
          title: '智慧食堂管理系统',
          options: [],
          user: {
              name: '',
              role: '',
          },
          restaurantObj: {},
        };
    },
    mounted() {
        this.Init();
        this.getRestaurant();
    },
    methods: {
        ...mapMutations({
            setCateenInfo: 'setCateenInfo'
        }),
        Init(){
            const userInfo= localStorage.getItem("userInfo");
            console.log(1);
            console.log(userInfo);
            console.log(this.user);
            if(Object.keys(userInfo).length) {
                this.user.name = JSON.parse(userInfo).userName;
                this.user.role = JSON.parse(userInfo).roleName;
            }

        },
        signOut(){
            this.user.name='';
            this.user.role='';
            this.$router.push({ path: `/login` });
        },
        // 切换所属餐厅
        changeCateen(value) {
            this.setCateenInfo(value);
        },
        //获取所属餐厅
        getRestaurant(){
            const userInfo= localStorage.getItem("userInfo");
            console.log(userInfo)
            var data = JSON.parse(userInfo).userId;
                console.log(data);
            var config = {
                method: 'post',
                url: window.$config+'api/Organization/GetOrganizationByUserId?userId='+data,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };
 
            axios(config)
            .then(rsp=>{
                if(rsp.data.status==1){
                    this.options=rsp.data.result;
                    console.log(this.options)
                    if(rsp.data.result && rsp.data.result.length) {
                        this.restaurantObj = rsp.data.result[0]; 
                        this.setCateenInfo(rsp.data.result[0]);
                    }
                } else {
                    console.log("获取失败")
                }
            })
            .catch(err=> console.log(err));
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    },
    watch: {
      restaurantObj: {
        handler: function (newValue, oldValue) {
            if(newValue!==oldValue){
               this.setCateenInfo(newValue);
            }
        }
      }
    }
};
</script>

<style scoped lang="scss">
.home {
    width: 100%;
    height: 100%;
    .header {
        height: 79px;
        line-height: 79px;
        padding:0 30px 0 20px;
        box-shadow: 0 5px 10px #000000;
        overflow: hidden;
        background-color: #FFFFFF;
        .headerLogo {
          float: left;
          img{
            width: 180px;
            height: 49px;
            margin: 15px 0;
            float: left;
          }
          sapn{
            margin-left:33px;
            font-size: 14px;
          }
        }
        .headerUser{
          float: right;
          .headerBadge{
            float: left;
            display: none;
          }
          .headerUserText{
            font-size: 16px;
          }
          .el-select{
            margin-right: 52px;
            input{
              color: #d5d4d4;
            }
          }
          .el-avatar{
            margin: 10px 6px;
            display: inline-table;
          }
          .headerUserRole{
            font-style: normal;
            background: #1890ff;
            color: #FFFFFF;
            font-size: 12px;
            padding:3px 5px;
            border-radius: 0 10px 3px 20px;
            margin-right: 27px;
          }
        }
    }
    .mainBox{
      @include flex();
      height: calc(100% - 79px);
      .sider{
        width: 214px;
        height: 100%;
        ul{
          height: 100%;
        }
      }
      .main{
        flex: 1;
        max-width: calc(100% - 214px);
        background: #FFFFFF;
        padding:12px;
        margin: 9px 0px 23px 5px;
        box-shadow: -5px 5px 15px #666666;
        border-radius: 6px;
        min-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
}
</style>
