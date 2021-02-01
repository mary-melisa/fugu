<!-- 正在建设中...-->
<template>
  <div class="building">
    <div class="content">
        <!-- <div><i class=" iconfont icon-ziyuan"/></div>-->
        <div><img src="@/assets/images/quanxian.png" class="buildImg"/></div>
        <div class="txt">权限不足，请联系管理员...</div> 
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
.building {
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
