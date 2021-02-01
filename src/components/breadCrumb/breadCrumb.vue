<template>
    <div class="breadcrumb">
        <i class="el-icon-arrow-right"></i>
        <i class="el-icon-s-home"></i>
        <span class="firstMenu">{{ firstMenu }}</span>
        <span class="space">/</span>
        <i class="el-icon-folder-opened"></i>
        <span class="secondMenu">{{ secondMenu }}</span>
    </div>
</template>

<script>
export default {
    props: ['firstMenu', 'secondMenu'],
};
</script>

<style lang="scss" scoped>
.breadcrumb {
    width: 100%;
    padding: 15px 20px 10px 5px;
    height: 24px;
    font-size: 16px;
    color: black;
    i {
        font-size: 16px;
        line-height: 24px;
        color: #101010;
    }
    i.el-icon-s-home {
        color: #333333;
        margin-left: 10px;
    }
    i.el-icon-folder-opened {
        color: #1890ff;
    }
    .space {
        color: #333333;
        margin: 0 10px;
    }
    .firstMenu {
        color: #333333;
    }
    .secondMenu {
        color: #1890ff;
    }
}
</style>
