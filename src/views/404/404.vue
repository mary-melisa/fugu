<!-- 正在建设中...-->
<template>
  <div class="nopage">
    <div class="content">
        <!-- <div><i class=" iconfont icon-ziyuan"/></div>-->
        <div><img src="@/assets/images/404.png" class="buildImg"/></div>
        <div class="txt">网站错误，请稍后再试...</div> 
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    components: {
     },
    data(){
      return{
        
      }
    },
    created() {
        
    },
    methods: {

    },
  }
</script>

<style scoped lang="scss">
.nopage {
    width: 100%;
    height: 100%;
    position: relative;
    .content {
        @include position(absolute, 50%, auto, auto, 50%);
        transform: translate(-50%, -50%);
        .icon-ziyuan {
            font-size: 200px;
            color: #888888;
        }
        div {
            width: 100%;
            text-align: center;
        }
        .txt {
            font-size: 14px;
            color: #666666;
        }
        .buildImg {
            max-width: 200px;
            max-height: 200px;
        }
    }
}
</style>
