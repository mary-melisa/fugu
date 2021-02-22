<template>
  <el-dialog class="commonDialog" :title="parentTitle === 1 ? '新增物料信息' : '编辑物料信息'" :visible.sync="visible"
    :close-on-click-modal="false" width="400px" :before-close="cancelModule">
    <el-form ref="addMeal" :rules="rules" class="commonForm mt45" :model="addMeal" label-width="35%">
      <el-form-item label="物料类别:" prop="materialCategory" required>
        <el-select class="commonSelect" v-model="addMeal.materialCategory" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.id">
            {{item.categoryName}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料名称:" prop="materialName" required>
        <el-input class="commonInput" v-model="addMeal.materialName" :disabled="parentTitle === 1 ? false : true"
          maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="物料单位:" prop="materialUnit" required>
        <el-select class="commonSelect" v-model="addMeal.materialUnit" placeholder="请选择">
          <el-option v-for="item in Companys" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" class="commonTextarea" v-model="addMeal.remark" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item class="btnsLine mt60">
        <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
        <el-button class="commonButton" @click.prevent="submitForm('addMeal')" v-if="parentTitle === 1">确定</el-button>
        <el-button class="commonButton" @click.prevent="submitEditForm('addMeal')" v-if="parentTitle === 2">确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import axios from 'axios';
export default {
  props: ['parentDialogVisible', 'getParentTableData', 'parentTitle', 'parentCurrentMeal', 'flag'],
  data () {
    return {
      urlPrev: 'http://39.106.7.166:8097/',
      visible: false,
      options: [], //物料类别
      addMeal: {
        materialCategory: '',
        materialName: '',
        materialUnit: '',
        remark: ''
      },
      defaultProps: {
        pageSize: 10000,
        pageIndex: 1
      },
      rules: {
        materialCategory: [
          { required: true, message: '请选择物料类别', trigger: 'change' }
        ],
        materialName: [
          { required: true, message: '请填写物料名称', trigger: 'blur' }
        ],
        materialUnit: [
          { required: true, message: '请填写物料单位', trigger: 'blur' }
        ]
      },
      Companys: [
        {
          value: '斤',
          label: '斤'
        },
        {
          value: '个',
          label: '个'
        },
        {
          value: '瓶',
          label: '瓶'
        },
        {
          value: '盘',
          label: '盘'
        },
        {
          value: '包',
          label: '包'
        },
        {
          value: '只',
          label: '只'
        },
        {
          value: '条',
          label: '条'
        },
        {
          value: '颗',
          label: '颗'
        },
        {
          value: '其他',
          label: '其他'
        },
      ]
    }
  },
  mounted () {
    this.visible = true;
    this.init();
  },
  methods: {
    async init () {
      await this.getTableData();
      if (this.parentTitle === 2) {
        this.initFormData();
      }
    },
    // 编辑初始化表单
    initFormData () {
      var data = JSON.parse(JSON.stringify(this.parentCurrentMeal));
      let obj = this.options.find(item => item.categoryName === data.materialCategoryName);
      if (obj && Object.keys(obj).length) {
        this.addMeal.materialCategory = obj.id;
      }
      console.log(obj.id);
      this.addMeal.materialName = data.materialName;
      this.addMeal.materialUnit = data.materialUnit;
      this.addMeal.remark = data.remark;
      this.addMeal.id = data.id;
    },
    //关闭弹框
    cancelModule (val) {
      this.$emit('cancelModule', val);
      if (this.flag === 'add') {
        this.$router.push({
          name: 'nutrients'
        })
      }
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
    // 编辑餐别
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
    //获取物料类别
    async getTableData () {
      var config = {
        method: 'post',
        url: this.urlPrev + 'api/bdmateriatype/getmateriatype',
        data: this.defaultProps
      };
      await axios(config)
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.options = rsp.data.result;
            console.log(this.options)
          } else {
            console.log("获取失败")
          }
        })
        .catch(err => console.log(err));
    },

    // 添加餐别
    mealSave () {
      const url = this.urlPrev + `api/bdmaterial/addmaterial`;
      axios({ method: 'post', url: url, data: this.addMeal })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$emit('getParentTableData');
            this.$message({
              message: '添加成功',
              type: 'success',
            });
            this.cancelModule(false);
          } else if(rsp.data.message){
            this.$message({
              message: rsp.data.message,
              type: 'error',
            });
          }
        })
        .catch(err => console.log(err));
      return false;
    },
    // 编辑物料信息
    mealEdit () {
      const url = this.urlPrev + `api/bdmaterial/editmaterial`;
      axios({ method: 'post', url: url, data: this.addMeal })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$emit('getParentTableData');
            this.$message({
              message: '编辑成功',
              type: 'success',
            });
            this.cancelModule(false)
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