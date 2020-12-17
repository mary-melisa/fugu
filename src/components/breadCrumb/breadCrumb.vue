<template>
    <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">基础数据</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">餐别设置</a></el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.breadcrumb {
    margin-bottom: 20px;
}
</style>
