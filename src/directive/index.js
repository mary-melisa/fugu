import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
    bind(el) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        dialogHeaderEl.onmousedown = e => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL, styT;

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                /* eslint-disable */
        styL =
          +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT =
          +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100); 
        /* eslint-disable */
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      };

      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
});

// v-dialogDrag: 弹窗拖拽
Vue.directive('pullup', {
  bind(el) {
    el.onmousedown = e => {
      let orderBox = document.getElementById('orderBox');
      let goodsBox = document.getElementById('goodsBox');
      let oEvent = e || event;
      let Y_start = oEvent.clientY;
      let H_start = orderBox.offsetHeight;
      //let goodsBox_H = goodsBox.offsetHeight;
      let innerHeight = window.innerHeight;
      document.onmousemove = e => {
          let oEvent = e || event;
          let Y_end = oEvent.clientY;
          if (H_start + (Y_start - Y_end) > 330 && H_start + (Y_start - Y_end) <= window.innerHeight * 0.9) {
              //鼠标移动Y轴高度
              let pullup_org_height = H_start + (Y_start - Y_end);
              //单据盒子 = 本身高度 + 鼠标移动Y轴高度
              orderBox.style.height = pullup_org_height + 'px';
              //商品盒子 = 屏幕高度 - 单据盒子的高度
              goodsBox.style.height = innerHeight - pullup_org_height + 'px';
          }
      };
      document.onmouseup = () => {
          document.onmousemove = document.onmouseup = null;
          // let boxHeight = {
          //     orderBoxH: orderBox.style.height,
          //     goodsBoxH: goodsBox.style.height,
          // };
          // SessionUtil.setItem('boxHeight', boxHeight);
      };
  };
},
});