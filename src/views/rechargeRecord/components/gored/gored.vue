<template>
  <el-dialog title="冲红" class="commonDialog miniDialog" width="400px" :visible.sync="dialogFormVisible" :before-close="close"  :close-on-click-modal="false">
      <el-form class="commonForm mt15">
        <el-form-item label="冲红金额:" :label-width="formLabelWidth">
          <el-input v-model="amount" class="commonInput" ></el-input>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button class="commonButton" @click="close">取消</el-button>
        <el-button class="commonButton" @click="makeSure" >确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
    props:['cancelModule', 'consumerushred'],
    data(){
        return{
          dialogFormVisible: true,
          amount: '',
          formLabelWidth: '35%',
        }
    },
    mounted(){

    },
    methods:{
      close() {
        this.$emit('cancelModule');
      },
      makeSure(){
        this.$emit('consumerushred', this.amount);
      }
    }
}
</script>

<style lang="scss" scoped>
::v-deep.miniDialog {
  .el-dialog {
    .el-dialog__body {
      .button {
        text-align: center;
      }
    }
  }
}
</style>