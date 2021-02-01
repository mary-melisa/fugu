<template>
    <el-dialog class="commonDialog miniDialog" width="400px" title="账户充值" align="center" :visible.sync="visible" :before-close="close" :close-on-click-modal="false">
    <el-row class="commonRow"  v-if="flag === 1">
        <el-col :span="8">姓名：</el-col>
        <el-col :span="16">{{ currentMeal.userName }}</el-col>
    </el-row>
    <el-row class="commonRow" v-if="flag === 1">
        <el-col :span="8">账户余额：</el-col>
        <el-col :span="16">{{ currentMeal.amount }}</el-col>
    </el-row>
    <el-row class="commonRow">
        <el-col :span="8">充值金额：</el-col>
        <el-col :span="16"><el-input class="commonInput" type="number" v-model="amount" style="width: 150px;"></el-input><span class="fl ml10">元</span></el-col>
    </el-row>
    <div class="button">
        <el-button class="commonButton" @click="close">取消</el-button>
        <el-button class="commonButton" @click="makeSure" v-if="flag === 1" >确认</el-button>
        <el-button class="commonButton" @click="someCharge" v-if="flag === 2" >确认</el-button>
    </div>
</el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
export default {
    props: ['getTableData', 'parentClo', 'currentMeal', 'userInfo', 'flag', 'multipleSelection'],
    data() {
        return {
            visible: true,
            amount: ''
        }
    },
    mounted(){

    },
    methods: {
        close(){
            this.$emit('parentClo');
        },
        // 餐卡充值
        makeSure(){
            let obj = {};
            obj.userId = this.currentMeal.id;
            if(this.amount) {
                obj.amount = this.amount;
            }else {
                this.$message.closeAll();
                this.$message({
                    message: '请输入充值金额',
                    type: 'warn'
                })
                return false;
            }
            // obj.waterNumber = moment(new Date()).format('YYYYMMDDHHmmssSSSS');
            obj.accountNumber = this.currentMeal.accountNumber;
            console.log(obj);
            let arr = [];
            arr.push(obj);
            const url = window.$moneyUrl + `api/mealcard/rechargemealcard`;
            let options = {
                method: 'post',
                url: url,
                data: arr
            };
            this.charge(options);
            // axios({ method: 'post', url: url, data: arr})
            //     .then(rsp => {
            //         if (rsp.data.status == 1) {
            //             this.$message({
            //                 message: '充值成功！',
            //                 type: 'success',
            //             });
            //             this.$emit('getTableData');
            //             this.close();
            //         }else if(rsp.data.message){
            //             this.$message({
            //                 message: rsp.data.message,
            //                 type: 'error',
            //             });
            //         }
            //     })
            //     .catch(err => console.log(err));
        },
        charge(options) {
            // const url = window.$moneyUrl + `api/mealcard/rechargemealcard`;
            // axios({ method: 'post', url: url, data: arr})
            axios(options)
                .then(rsp => {
                    if (rsp.data.status == 1) {
                        this.$message({
                            message: '充值成功！',
                            type: 'success',
                        });
                        this.$emit('getTableData');
                        this.close();
                    }else if(rsp.data.message){
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
        },
        // 批量充值
        someCharge() {
            let arr = [];
            let that = this;
            if(this.amount) {
                this.multipleSelection.forEach(item => {
                    arr.push({
                        amount: that.amount,
                        accountNumber: item.accountNumber,
                        userId: item.id
                    })
                });
                const url = window.$moneyUrl + `api/mealcard/rechargemealcard`;
                let options = {
                    method: 'post',
                    url: url,
                    data: arr
                };
                this.charge(options);
            }else {
                this.$message.closeAll();
                this.$message({
                    message: '请输入充值金额',
                    type: 'warn'
                })
                return false;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep.commonRow.el-row {
        border-bottom: 0;
        .el-col:first-child {
            justify-content: flex-end;
        }
    }
</style>