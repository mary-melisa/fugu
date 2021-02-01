<template>
    <div id="app" v-loading="loading" element-loading-text="正在加载中" style="height: 100vh;">
        <router-view />
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name: 'App',
    provide() {
        return {
            config: this.config,
            publicPath: process.env.BASE_URL,
        };
    },
    data() {
        return {
            loading: false,
            config: {
                wordConfig: null,
            },
        };
    },
    created() {
        //网络由异常到正常时触发
        window.addEventListener(
            'online',
            () => {
                this.$message({ message: '网络连接上了', type: 'success' });
            },
            false,
        );
        //网络由正常常到异常时触发（此处代处理）
        window.addEventListener(
            'offline',
            () => {
                this.$message({ message: '您的网络不可用,请检查', type: 'error' });
            },
            false,
        );
    },
    mounted() {},
    computed: {
        ...mapState({}),
        ...mapGetters({}),
    },
    methods: {
        ...mapActions({}),
    },
};
</script>

<style></style>
