<template>
    <div class="add">
        <el-button type="text" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>

        <el-dialog title="新增餐别" :visible.sync="dialogFormVisible" class="modeladd">
        <el-form :model="form">
            <el-form-item label="所属食堂" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" class="input"></el-input>
            </el-form-item>
            <el-form-item label="餐别名称" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择餐别">
                <el-option label="早餐" value="shanghai"></el-option>
                <el-option label="午餐" value="beijing"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="开始时间" :label-width="formLabelWidth">
                <el-time-picker
                    v-model="value1"
                    :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                    }"
                    placeholder="任意时间点">
                </el-time-picker>
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
                desc: ''
            },
            formLabelWidth: '120px',
            value1: new Date(2016, 9, 10, 18, 40)
        }
    }
}
</script>

<style lang="scss" scoped>
    .add{
        margin-bottom: 10px;
    }
    .input{
        width: 193px;
    }
    .modeladd{
        width: 100%;
    }
</style>
