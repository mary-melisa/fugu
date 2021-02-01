<!-- 登录 -->
<template>
    <div class="loginbg">
        <div class="login">
            <div class="logintop">
                智慧食堂管理系统
            </div>
            <div class="logins">
                <div class="loginall">
                    <el-form  :model="loginForm" :rules="rules" ref="loginForm">
                        <el-form-item prop="name" class="useing">
                            <el-input
                                placeholder="用户名/手机号码"
                                prefix-icon="el-icon-user-solid"
                                v-model="loginForm.name"
                                @keyup.enter.native="submitForm('loginForm')"
                                required>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password" class="password">
                            <el-input
                                placeholder="字母和数字的组合，不少于八位"
                                prefix-icon="el-icon-lock"
                                v-model="loginForm.password"
                                show-password
                                @keyup.enter.native="submitForm('loginForm')"
                                required>
                            </el-input>
                        </el-form-item>
                        <div class="botton">
                            <el-button class="loginBtn" @click="submitForm('loginForm')">登录</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from 'axios';
export default {
     data() {
        return {
            loginForm:{
                name: '',
                password:'',
            },
            loading: null,
            rules: {
                name: [
                    { required: true, message: '请输入用户名/手机号码', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    methods:{
        ...mapMutations({
            setCateenInfo: 'setCateenInfo'
        }),
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.login();
            } else {
                console.log('提交错误!!');
                return false;
            }
            });
        },
        login(){
             this.loading = this.$loading({
                lock: true,
                text: '登录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            console.log(this.loginForm.name);
            localStorage.setItem("userInfo", {});
            // localStorage.setItem("userCateen", {});
            this.setCateenInfo({});
            var data = JSON.stringify({"name":this.loginForm.name,"password":this.loginForm.password});
                console.log(data);
            var config = {
                method: 'post',
                url: window.$config+'api/Account/Login',
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            }; 
            axios(config)
            .then(function (response) {
                this.loading.close();
                console.log(response);
                if(response.data.status === 1) {
                    let user = decodeURIComponent(escape(window.atob(response.data.result.split('.')[1])));
                    console.log(user);
                    localStorage.setItem("userInfo",user); 
                    this.$router.push({ path: `/home` });
                }else if(response.data.message) {
                    this.$message.close();
                    this.$message({
                        message: response.data.message,
                        type: 'error'
                    });
                }
            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.loading.close();
            });
        }
    }
};
</script>

<style scoped lang="scss">
    .loginbg{
       width: 100%;
       height: 100%;
       min-height: 100%;
       background: url(../../assets/images/loginBg.jpg) center center no-repeat;
       background-size: cover;
       position: relative;
       .login {
           text-align: center;
           @include position(absolute, 50%, auto, auto, 50%);
           transform: translate(-50%, -50%);
            .logintop{
                font-size: 24px;
                color: white;
            }
            .logins{
                margin-top: 30px;
                text-align: center;
                .loginall{
                    text-align: center;
                    .useing{
                        margin: 30px;
                    }
                    .password{
                        margin: 30px;
                    }
                    .button {
                        text-align: center;
                    }
                    ::v-deep.el-input {
                        .el-input__inner {
                            width: 280px;
                        }
                    }
                    ::v-deep.el-button.loginBtn {
                        width: 200px;
                        height: 40px;
                        line-height: 40px;
                        padding: 0;
                        text-align: center;
                        border-color: transparent;
                        @include linearGradient(to bottom, #55baf5, #1d9ef0);
                        @include rounded-corners(20px);
                        span {
                            line-height: 40px;
                            color: white;
                            font-size: 18px;
                        }
                        &:hover {
                            @include linearGradient(to bottom, rgba(85, 186, 245, .8), rgba(29, 158, 240, .8));
                            span {
                                color: rgba(255, 255, 255, .8);
                            }
                        }
                    }
                }
            }
       }
    }
</style>
