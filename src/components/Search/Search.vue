<template>
    <div class="search">
        <div class="input">物料名称：<el-input placeholder="请输入物料名称" v-model="input" style="width:200px" clearable> </el-input></div>
        <div><el-button type="primary">查询</el-button><el-button type="primary">添加</el-button></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: '',
        };
    },
};
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    margin-bottom: 20px;
}
.input {
    margin-right: 40px;
}
</style>
