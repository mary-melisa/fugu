<!-- 菜品选择弹窗 -->
<template>
    <el-dialog
        class="commonDialog"
        title="菜品选择"
        :visible.sync="visible"
        :append-to-body="true"
        width="280px"
        :close-on-click-modal="false"
        :before-close="close1">
        <el-row class="commonRow" v-for="(item, index) in list" :key="index">
                <el-col :span="8">{{item.materialName}}</el-col>
                <el-col :span="14"><el-input type="number" class="commonInput" style="width:80px;" :min="0" @input.native="onInput0" onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" v-model="item.materialUnit"></el-input><span class="fl"> g</span></el-col>
                <el-col :span="2" ><a @click="delDish(item)"><i class=" el-icon-delete"></i></a></el-col>
        </el-row>
    </el-dialog>
</template>
<script>
//   import axios from 'axios';
  export default {
    props: ['closeWeight', 'changeTerpineList', 'handleSelectionChange', 'toggleSelection'],
    components: {
     },
    data(){
      return{
       visible: true,
       list: []
      }
    },
    created() {

    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            this.list = this.changeTerpineList;
        },
        onInput0(e) {
            this.$message.closeAll();
            if (e.target.value < 0) {
                this.$message.warning("只能输入大于0的数");
                e.target.value = null;
            }
        },
         delDish(row){
            let rows = [];
            delete row.materialUnit;
            console.log(row);
            if(Object.keys(row).length) {
                rows.push(row);
            }
            let arr = this.list;
            let newArr = arr.filter(function (item) {
                return item.id != row.id  //将数组中的某个对象去掉
            })
            this.$emit('toggleSelection', newArr);
            // console.log(newArr);
            // this.toggleSelection(rows);
            // this.handleSelectionChange(newArr);
        },
        // 关闭弹窗
        close1(){
            this.list.every(item => {
                if(!item.materialUnit) {
                    this.$message.closeAll();
                    this.$message({
                        message: '请输入选中的物料的重量',
                        type: 'warn'
                    })
                    return false;
                }else {
                    this.$emit('handleSelectionChange', this.list);
                    this.$emit('closeWeight')
                }
            })
        }
    },
    watch: {
        // changeTerpineList: {
        //     handler(newValue) {
        //         if(newValue){
        //             let arr = newValue;
        //             this.list = arr;
        //         }
        //     },
        //     deep: true
        // }
    }
}
</script>

<style scoped lang="scss">
.commonRow.el-row {
    .commonInput.el-input {
        margin-right: 10px;
        margin-left: 10px;
    }
    .el-col {
        a {
            display: inline-block;
            padding: 0 5px;
            .el-icon-delete {
                line-height: 30px;
            }
        }
    }
}
</style>
