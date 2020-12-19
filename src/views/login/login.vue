<!-- 登录 -->
<template>
    <div class="loginbg">
        <div class="login">
            <div class="logintop">
                智慧食堂管理系统
            </div>
            <div class="logins">
                <div class="loginall">
                    <div class="useing">
                        <el-input
                            placeholder="用户名/手机号码"
                            prefix-icon="el-icon-user-solid"
                            v-model="loginForm.name">
                        </el-input>
                    </div>
                    <div class="password">
                        <el-input
                            placeholder="字母和数字的组合，不少于八位"
                            prefix-icon="el-icon-lock"
                            v-model="loginForm.password"
                            show-password
                            >
                        </el-input>
                    </div>
                    <div class="botton">
                        <el-button plain @click="login">登陆</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
     data() {
        return {
             urlPrev: 'http://sysapi.free.idcfengye.com/',
            loginForm:{
                name: '',
                password:'',
            }
        };
    },
    methods:{
        login(){
            console.log(this.loginForm.name);
            //var axios = require('axios');
            var data = JSON.stringify({"name":this.loginForm.name,"password":this.loginForm.password});
                console.log(data);
            var config = {
                method: 'post',
                url: this.urlPrev+'api/Account',
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };

            axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data.result));
                let user = decodeURIComponent(escape(window.atob(response.data.result.split('.')[1])));
                let res = JSON.parse(user).aud;  
                console.log(res);
            })
            .catch(function (error) {
                console.log(error);
            });
            if(data.status==1){
                  
                } else {
                    console.log("获取失败")
                }
        }
    }
};
</script>

<style scoped lang="scss">
    .loginbg{
        text-align: center;
        margin-left: 30%;
    }
    .login{
        width: 500px;
        height: 500px;
        margin-top: 200px;
    }
    .logintop{
        font-size: 24px;
    }
    .logins{
        margin-top: 30px;
        text-align: center;
    }
    .loginall{
        text-align: center;
    }
    .useing{
        margin: 30px;
    }
    .password{
        margin: 30px;
    }
</style>
