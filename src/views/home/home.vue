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
              <el-select v-model="value" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <span class="headerUserName">{{ user.name }}</span>
              <el-avatar :size="40">
                  <i class="el-icon-user"></i>
              </el-avatar>
              <i class="headerUserRole">{{ user.role }}</i>
              <i class="el-icon-edit" @click="signOut()"></i>
          </div>
      </div>
      <div class="mainBox">
          <div class="sider">
              <el-menu default-active="2" class="commonMenus" @open="handleOpen" @close="handleClose" background-color="#333333" text-color="#fff" active-text-color="#1890FF" unique-opened>
                  <el-submenu index="1">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>运营数据</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to=""><el-menu-item index="1-1">营业数据</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="1-2">会员数据</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="1-3">菜品数据</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="1-4">充值数据</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="2">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>备餐管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to=""><el-menu-item index="2-1">预定管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="2-2">备菜计划</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="2-3">套餐管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="2-4">菜品管理</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="3">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>财务管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to=""><el-menu-item index="3-1">消费记录</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="3-2">会员管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="3-3">餐卡管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="3-4">冲红记录</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="3-5">订单管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="3-6">结算管理</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="4">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>评价管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to=""><el-menu-item index="4-1">菜品评价</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="4-2">意见反馈</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="5">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>基础数据</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/mealSetting"><el-menu-item index="5-1">餐别设置</el-menu-item></router-link>
                          <router-link to="/nutrients"><el-menu-item index="5-2">营养成分</el-menu-item></router-link>
                          <router-link to="/matCategory"><el-menu-item index="5-3">物料类别</el-menu-item></router-link>
                          <router-link to="/matInformation"><el-menu-item index="5-4">物料信息</el-menu-item></router-link>
                          <router-link to="/customerType"><el-menu-item index="5-5">用户类型</el-menu-item></router-link>
                          <router-link to="/equipmentType"><el-menu-item index="5-6">设备类型</el-menu-item></router-link>
                          <!-- <router-link to=""><el-menu-item index="5-7">菜品类别</el-menu-item></router-link> -->
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="6">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>设备管理</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/facility"><el-menu-item index="6-1">设备列表</el-menu-item></router-link>
                          <router-link to="/maintenanceRecord"><el-menu-item index="6-2">保养记录</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="6-3">运行日志</el-menu-item></router-link>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="7">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>系统设置</span>
                      </template>
                      <el-menu-item-group>
                          <router-link to="/organizational"><el-menu-item index="7-1">组织架构</el-menu-item></router-link>
                          <router-link to="/userManage"><el-menu-item index="7-2">角色管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="7-3">用户管理</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="7-4">规则配置</el-menu-item></router-link>
                          <router-link to=""><el-menu-item index="7-5">菜单管理</el-menu-item></router-link>
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
import facility from "@/views/facility/facility.vue";
export default {
    components:{
      facility,
    },
    data() {
        return {
          urlPrev: 'http://sysapi.free.idcfengye.com/',
          title: '智慧食堂管理系统',
          options: [],
          user: {
              name: '超级管理员',
              role: '管理员',
          },
          value: '',
        };
    },
    mounted() {
        this.getRestaurant();
    },
    methods: {
        //获取所属餐厅
        getRestaurant(){
            const url = this.urlPrev+`api/Organization/GetOrganizationByUserId`;
            axios({method: 'post', url: url, data: this.userId})
            .then(rsp=>{
                if(rsp.data.status==1){
                    console.log(rsp)
                    this.result=rsp.data;
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
      }
    }
}
</style>
