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
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                  <el-submenu index="1">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>运营数据</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="1-1"><router-link to="">营业数据</router-link></el-menu-item>
                          <el-menu-item index="1-2"><router-link to="">会员数据</router-link></el-menu-item>
                          <el-menu-item index="1-3"><router-link to="">菜品数据</router-link></el-menu-item>
                          <el-menu-item index="1-4"><router-link to="">充值数据</router-link></el-menu-item>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="2">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>备餐管理</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="2-1"><router-link to="">预定管理</router-link></el-menu-item>
                          <el-menu-item index="2-2"><router-link to="">备菜计划</router-link></el-menu-item>
                          <el-menu-item index="2-3"><router-link to="">套餐管理</router-link></el-menu-item>
                          <el-menu-item index="2-4"><router-link to="">菜品管理</router-link></el-menu-item>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="3">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>财务管理</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="3-1"><router-link to="">消费记录</router-link></el-menu-item>
                          <el-menu-item index="3-2"><router-link to="">会员管理</router-link></el-menu-item>
                          <el-menu-item index="3-3"><router-link to="">餐卡管理</router-link></el-menu-item>
                          <el-menu-item index="3-4"><router-link to="">冲红记录</router-link></el-menu-item>
                          <el-menu-item index="3-5"><router-link to="">订单管理</router-link></el-menu-item>
                          <el-menu-item index="3-6"><router-link to="">结算管理</router-link></el-menu-item>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="4">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>评价管理</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="4-1"><router-link to="">菜品评价</router-link></el-menu-item>
                          <el-menu-item index="4-2"><router-link to="">意见反馈</router-link></el-menu-item>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="5">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>基础数据</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="5-1"><router-link to="">餐别设置</router-link></el-menu-item>
                          <el-menu-item index="5-2"><router-link to="">营养成分</router-link></el-menu-item>
                          <el-menu-item index="5-3"><router-link to="">物料类别</router-link></el-menu-item>
                          <el-menu-item index="5-4"><router-link to="">物料信息</router-link></el-menu-item>
                          <el-menu-item index="5-5"><router-link to="">用户信息</router-link></el-menu-item>
                          <el-menu-item index="5-6"><router-link to="">设备类型</router-link></el-menu-item>
                          <el-menu-item index="5-7"><router-link to="">菜品类别</router-link></el-menu-item>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="6">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>设备管理</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="6-1"><router-link to="/facility">设备列表</router-link></el-menu-item>
                          <el-menu-item index="6-2"><router-link to="/maintenanceRecord">保养记录</router-link></el-menu-item>
                          <el-menu-item index="6-3"><router-link to="">运行日志</router-link></el-menu-item>
                      </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="7">
                      <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>系统设置</span>
                      </template>
                      <el-menu-item-group>
                          <el-menu-item index="7-1"><router-link to="/organizational">组织架构</router-link></el-menu-item>
                          <el-menu-item index="7-2"><router-link to="">角色管理</router-link></el-menu-item>
                          <el-menu-item index="7-3"><router-link to="">用户管理</router-link></el-menu-item>
                          <el-menu-item index="7-4"><router-link to="">规则配置</router-link></el-menu-item>
                          <el-menu-item index="7-5"><router-link to="">菜单管理</router-link></el-menu-item>
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
import facility from "@/views/facility/facility.vue";
export default {
    components:{
      facility,
    },
    data() {
        return {
          title: '智慧食堂管理系统',
          options: [
              {
                  value: '1',
                  label: '餐厅一',
              },
              {
                  value: '2',
                  label: '餐厅二',
              },
              {
                  value: '3',
                  label: '餐厅三',
              },
          ],
          user: {
              name: '超级管理员',
              role: '管理员',
          },
          value: '',
        };
    },
    mounted() {

    },
     methods: {
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
