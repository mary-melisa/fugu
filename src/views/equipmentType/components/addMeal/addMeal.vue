<template>
  <el-dialog class="commonDialog" :title="parentTitle === 1 ? '新增类型名称' : '编辑类型名称'" :visible.sync="visible"
    :close-on-click-modal="false" width="400px" :before-close="cancelModule">
    <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="35%">
      <el-form-item label="类型名称:" prop="equimentTypeName" required>
        <el-input class="commonInput" v-model="addMeal.equimentTypeName" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" class="commonTextarea" v-model="addMeal.remark" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item class="btnsLine mt60">
        <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
        <el-button class="commonButton" @click.native="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
        <el-button class="commonButton" @click.native="submitEditForm('addMeal')" v-if="parentTitle === 2">确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import { formatDate } from '@/filters/index';
export default {
  props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal'],
  data () {
    return {
      urlPrev: window.$facilityUrl,
      visible: false,
      addMeal: {
        equimentTypeName: '',
        remark: '',
      },
      rules: {
        equimentTypeName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ]
      },
    }
  },
  mounted () {
    this.visible = true;
    if (this.parentTitle === 2) {
      this.initFormData();
    }
  },
  methods: {
    // 编辑初始化表单
    initFormData () {
      this.addMeal = JSON.parse(JSON.stringify(this.parentCurrentMeal));
    },
    //关闭弹框
    cancelModule (val) {
      this.$emit('cancelModule', val);
    },
    // 新增餐别
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mealSave();
        } else {
          console.log('提交错误!');
          return false;
        }
      });
    },
    // 编辑
    submitEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mealEdit();
        } else {
          console.log('提交错误!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    // 添加
    mealSave () {
      const url = this.urlPrev + `api/FaciliType/addequitype`;
      axios({ method: 'post', url: url, data: this.addMeal })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$emit('getParentTableData');
            this.$message({
              message: '添加成功',
              type: 'success',
            });
            this.cancelModule(false);
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
    // 编辑
    mealEdit () {
      let obj = {};
      if (this.addMeal.remark) {
        obj.remark = this.addMeal.remark;
      }
      if (this.addMeal.equimentTypeName) {
        obj.equimentTypeName = this.addMeal.equimentTypeName;
      }
      if (this.addMeal.id) {
        obj.id = this.addMeal.id;
      }
      const url = this.urlPrev + `api/FaciliType/editequitype`;
      axios({ method: 'post', url: url, data: obj })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$emit('getParentTableData');
            this.$message({
              message: '编辑成功',
              type: 'success',
            });
            this.cancelModule(false);
          } else {
            this.$message({
              message: rsp.data.message,
              type: 'error',
            });
          }
        })
        .catch(err => console.log(err));
      return false;
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.commonDialog {
    .el-dialog {
        min-height: 200px;
        .el-dialog__body {
            min-height: 100px;
            padding: 10px 8px;
        }
    }
}
</style>