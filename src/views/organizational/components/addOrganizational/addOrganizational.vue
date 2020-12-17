<template>
 <el-dialog
  class="commonDialog"
  title="添加"
  :visible.sync="parentDialogVisible"
  width="366px"
  :before-close="close">
   <el-tabs class="dialogTabs" v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="添加组织" name="first">
        <el-form ref="form" :model="addOrgnForm" label-width="80px">
            <el-form-item label="所属上级">
                <el-input v-model="addOrgnForm.a1"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                 <el-input v-model="addOrgnForm.a2"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
                <el-input v-model="addOrgnForm.a3"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="addOrgnForm.a4"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="addOrgnForm.a5"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="addOrgnForm.a6"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button>取消</el-button>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
    <el-tab-pane label="添加食堂" name="second">
         <el-form ref="form" :model="addCanteenForm" label-width="80px">
            <el-form-item label="食堂名称">
                <el-input v-model="addCanteenForm.a1"></el-input>
            </el-form-item>
            <el-form-item label="业务模式">
                 <el-input v-model="addCanteenForm.a2"></el-input>
            </el-form-item>
            <el-form-item label="食堂地址">
                <el-input v-model="addCanteenForm.a3"></el-input>
            </el-form-item>
            <el-form-item label="就餐人数">
                <el-input v-model="addCanteenForm.a4"></el-input>
            </el-form-item>
            <el-form-item label="食堂负责人">
                <el-input v-model="addCanteenForm.a5"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="addCanteenForm.a6"></el-input>
            </el-form-item>
            <el-form-item label="食堂照片">
                <el-input type="textarea" v-model="addCanteenForm.a7"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button>取消</el-button>
                <el-button type="primary" @click="onSubmit1">确定</el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
  </el-tabs>
</el-dialog>
</template>
<script>
export default {
    props: ['parentDialogVisible'],
    data() {
        return {
            activeName: 'first',
            addOrgnForm: {
                a1: '',
                a2: '',
                a3: '',
                a4: '',
                a5: '',
                a6: '',                
            },
            addCanteenForm: {
                a1: '',
                a2: '',
                a3: '',
                a4: '',
                a5: '',
                a6: '',  
                a7: '' 
            }
        }
    },
     methods: {
         close() {
             this.$emit('closeDialog', false)
         },
         onSubmit() {

         },
         onSubmit1(){

         },
         handleClick(tab, event) {
            console.log(tab, event);
         }
     }
}
</script>
<style lang="scss" scoped>

</style>