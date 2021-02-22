<template>
    <div class="data-box">
        <div class="data-item">
            <div class="header-box">
                <div class="title">基础数据</div>
                <div class="line"></div>
            </div>
            <div class="menu-box">
                <div class="menu-item" @click="go('customerType', '9-4')">
                    <img class="icon" src="@/assets/images/business_1.png" alt=""/>
                    <div class="menu-name">用户类型</div>
                </div>
                <div class="menu-item" @click="go('matInformation', '9-3')">
                    <img class="icon" src="@/assets/images/business_2.png" alt=""/>
                    <div class="menu-name">物料信息</div>
                </div>
                <div class="menu-item" @click="go('matCategory', '9-2')">
                    <img class="icon" src="@/assets/images/business_3.png" alt=""/>
                    <div class="menu-name">物料类别</div>
                </div>
                <div class="menu-item" @click="go('nutrients', '9-1')">
                    <img class="icon" src="@/assets/images/business_4.png" alt=""/>
                    <div class="menu-name">营养成分</div>
                </div>
            </div>
        </div>
        <div class="data-item">
            <div class="header-box">
                <div class="title">系统设置</div>
                <div class="line"></div>
            </div>
            <div class="menu-box">
                <div class="menu-item" @click="go('userManagement', '10-3')">
                    <img class="icon" src="@/assets/images/business_5.png" alt=""/>
                    <div class="menu-name">用户管理</div>
                </div>
                <div class="menu-item" @click="go('organizational', '10-1')">
                    <img class="icon" src="@/assets/images/business_6.png" alt=""/>
                    <div class="menu-name">组织架构</div>
                </div>
            </div>
        </div>
        <div class="data-item">
            <div class="header-box">
                <div class="title">会员数据</div>
                <div class="line"></div>
            </div>
            <div class="menu-box">
                <div class="menu-item" @click="go('memberData', '5-3')">
                    <img class="icon" src="@/assets/images/business_7.png" alt=""/>
                    <div class="menu-name">会员数据</div>
                </div>
            </div>
        </div>
        <div class="data-item">
            <div class="header-box">
                <div class="title">财务管理</div>
                <div class="line"></div>
            </div>
            <div class="menu-box">
                <div class="menu-item" @click="go('memManagement', '4-1')">
                    <img class="icon" src="@/assets/images/business_8.png" alt=""/>
                    <div class="menu-name">账户信息</div>
                </div>
                <div class="menu-item" @click="go('recConsumption', '4-2')">
                    <img class="icon" src="@/assets/images/business_9.png" alt=""/>
                    <div class="menu-name">消费流水</div>
                </div>
                <div class="menu-item" @click="go('redRecord', '4-3')">
                    <img class="icon" src="@/assets/images/business_10.png" alt=""/>
                    <div class="menu-name">冲红记录</div>
                </div>
                <div class="menu-item" @click="go('rechargeRecord', '4-4')">
                    <img class="icon" src="@/assets/images/business_11.png" alt=""/>
                    <div class="menu-name">充值记录</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },

    methods:{
        //跳转
        go(name, idx){
            console.log(name)
            this.$router.push({name:name, params: {index: idx}});
        }
    }
}
</script>

<style lang="scss" scoped>
.data-box{
    width: 100%;
    height: 100%;
    .data-item{
        padding: 10px 0 0 0;
        .header-box{
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 10px 0;
            .title{
                font-size: 18px;
                color: $blue;
                width: 90px;
                padding: 0 0 0 15px;
                display: inline-table;
            }
            .line{
                width: 100%;
                height: 1px;
                background: $blue;
            }
        }
        .menu-box{
            display: flex;
            flex-wrap: wrap;
            padding: 10px 25px;
            .menu-item{
                display: flex;
                flex-direction: column;
                align-items:center;
                cursor: pointer;
                margin-right: 120px;
                .icon{
                    width: 55px;
                    height: 55px;
                    object-fit: contain;
                }
                .menu-name{
                    padding: 10px 0 0 0;
                    font-weight: 600;
                    font-size: 13px;
                }
            }
        }
    }
}
</style>>
