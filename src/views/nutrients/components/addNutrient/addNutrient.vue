<template>
 <el-dialog
  class="commonDialog"
  title="添加物料营养成分"
  :visible.sync="visible"
  width="1210px"
  :append-to-body="true"
  :close-on-click-modal="false"
  :before-close="closeDialog">
        <div class="operBtn">
            <el-button class="conditionBtn" @click="select">选择物料</el-button>
            <el-button class="conditionBtn" @click="tocreate">新增物料</el-button>
        </div>
        <div class="tableContent">
            <el-table
                :data="adddishesList"
                class="commonTable"
                tooltip-effect="dark"
                height="100%"
                style="width: 100%"
                stripe
                border
                >
                <el-table-column
                    label="序号">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="物料名称"
                    prop="materialName"
                >
                </el-table-column>
                <el-table-column
                    label="热量(kcal)"
                >
                 <template slot-scope="scope">
                    <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="shortInput" v-model="scope.row.heat"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                    label="脂肪(g)"
                >
                <template slot-scope="scope">
                    <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="shortInput" v-model="scope.row.fat"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                    label="蛋白质(g)"
                >
                <template slot-scope="scope">
                    <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="shortInput" v-model="scope.row.protein"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                    label="碳水化合物(g)"
                >
                <template slot-scope="scope">
                    <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="shortInput" v-model="scope.row.carbohydrates"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                    label="膳食纤维(g)"
                >
                 <template slot-scope="scope">
                    <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="shortInput" v-model="scope.row.dietaryFiber"></el-input>
                </template>
                </el-table-column>
                <el-table-column
                    label="净重(g)"
                >
                 <template slot-scope="scope">
                    <el-input type="number" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" class="shortInput" v-model="scope.row.netWeight"></el-input>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="buttonBlocks">
            <el-button class="commonButton"  @click.native="create"  v-if="adddishesList.length">确定</el-button>
        </div>
        <SelectNutrient v-if="selectFlag" v-on:closeParentModule="closeModule" v-on:parentSelectNutrients="selectNutrients" :parentAdddishesList="adddishesList"></SelectNutrient>
</el-dialog>
</template>
<script>
import SelectNutrient from '../selectNutrient/selectNutrient.vue';
import axios from 'axios';
export default {
    props: ['getParentTableData', 'cancelModule'],
    components: {
        SelectNutrient
    },
    data() {
        return {
            urlPrev: 'http://39.106.7.166:8097/',
            visible: false,
            adddishesList: [],
            selectFlag: false
        }
    },
    mounted(){
         this.visible = true;
    },
    methods: {
         //关闭弹框
        closeDialog() {
            this.$emit('cancelModule', false);
        },
        closeModule() {
            this.selectFlag = false;
        },
        //选择物料
        select(){
            this.selectFlag = true;
        },
        selectNutrients(arr) {
            this.adddishesList = arr;
        },
        onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
        // 新增物料营养成分
        create() {
            const url = this.urlPrev + `api/bddishes/adddisheslist`;
            let rspList = this.adddishesList;
            rspList.forEach(item => {
                item["materialId"] = item.id;
            });
            axios({ method: 'post', url: url, data: rspList })
                .then(rsp => {
                    if (rsp.data.status == 1) {
                         this.$message({
                            message: '新增物料成功',
                            type: 'success',
                        });
                        this.adddishesList = [];
                        this.$emit('getParentTableData');
                        this.closeDialog();
                    } else {
                        this.$message({
                            message: rsp.data.message,
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
                return false;
        },
        // 跳转到新增物料路由
        tocreate() {
            this.$router.push({
                name: 'matInformation',
                params: {
                    flag: 'add'
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .operBtn {
        .el-button:first-child {
            margin-left: 0;
        }
    }
    .tableContent {
        padding-top: 20px;
        min-height: 440px;
        .el-table {
            min-height: 440px;
        }
    }
    .buttonBlocks {
        padding-top: 20px;
    }
</style>