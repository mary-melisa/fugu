<template>
    <div class="add">
        <el-button type="text" icon="el-icon-plus" @click="dialogFormVisible = true">添加</el-button>

        <el-dialog title="新增物料类别" :visible.sync="dialogFormVisible" class="modeladd">
        <el-form :model="form">
            <el-form-item label="类别名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" class="input"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
                type="textarea"
                class="commonTextarea"
                :rows="2"
                placeholder="请输入备注"
                v-model="textarea">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                textarea:''
            },
            formLabelWidth: '120px',
            value1: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .add{
        margin-right: 52px;
        margin-bottom: 10px;
    }
    .input{
        width: 193px;
    }
    .modeladd{
        width: 100%;
    }
</style>
