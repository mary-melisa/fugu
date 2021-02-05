<template>
  <el-dialog class="commonDialog" :title="parentFlag===1?'添加':'编辑'" :visible.sync="visible" v-loading="loading"
    element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" width="400px" :close-on-click-modal="false"
    :before-close="cancelModule">
    <el-tabs class="dialogTabs" v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane v-if="(parentActiveName==='first' && treeNode.isorgshow==1) "
        :label="parentFlag===1 ? '添加组织' : '编辑组织'" name="first">
        <el-form ref="addOrgnForm" class="commonForm" :rules="rules" :model="addOrgnForm" label-width="96px"
          @submit.native.prevent>
          <el-form-item label="所属上级:">
            <el-input class="commonInput" v-model="addOrgnForm.parentName" disabled></el-input>

          </el-form-item>
          <el-form-item label="名称:" prop="organizationName" required>
            <el-input class="commonInput" v-model="addOrgnForm.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" prop="userName" required>
            <el-input class="commonInput" v-model="addOrgnForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="mobile" required>
            <el-input class="commonInput" v-model="addOrgnForm.mobile" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="地址:" prop="address" required>
            <el-input class="commonInput" v-model="addOrgnForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input class="commonTextarea" type="textarea" v-model="addOrgnForm.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
            <el-button class="commonButton" @click.native="submitForm('addOrgnForm')" v-if="parentFlag === 1">确定
            </el-button>
            <el-button class="commonButton" @click.native="submitEditForm('addOrgnForm')" v-if="parentFlag === 2">确定
            </el-button>
            <el-input class="commonInput" v-model="addOrgnForm.parentId" type="hidden"></el-input>
            <el-input class="commonInput" v-model="addOrgnForm.id" type="hidden"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="(parentActiveName==='second' && treeNode.isorgshow==0)"
        :label="parentFlag === 1 ? '添加食堂' : '编辑食堂'" name="second">
        <el-form ref="addCanteenForm" class="commonForm" :model="addCanteenForm" :rules="canteenRules"
          label-width="120px" @submit.native.prevent>
          <el-form-item label="食堂名称:" prop="restaurantName">
            <el-input class="commonInput" v-model="addCanteenForm.restaurantName"></el-input>
          </el-form-item>
          <el-form-item label="业务模式:" prop="patternType">
            <el-select class="commonSelect" v-model="addCanteenForm.patternType">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食堂地址:" prop="address">
            <el-input class="commonInput" v-model="addCanteenForm.address" id="suggestId" @input="mapNameChange">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="map" id="map">
              <!-- <b-map id="map1" >
                        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    </b-map> -->
            </div>
            <div id="r-result"></div>
          </el-form-item>
          <el-form-item label="就餐人数:" prop="number">
            <el-input type="number" class="commonInput" :min="0" @input.native="onInput0"
              onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" v-model="addCanteenForm.number">
            </el-input>
          </el-form-item>
          <el-form-item label="食堂负责人:" prop="userName">
            <el-input class="commonInput" v-model="addCanteenForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="mobile" required>
            <el-input class="commonInput" v-model="addCanteenForm.mobile" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="食堂照片:">
            <el-upload ref="upload" class="avatar-uploader" accept=".jpg,.gif,.jpe,.jpeg,.png,.bmp" :action="imgUrl"
              :data="datas" name="UploadFile" :show-file-list="false" :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button class="commonButton" @click="cancelModule(false)">取消</el-button>
            <el-button class="commonButton" @click.native="submitCanteenForm('addCanteenForm')" v-if="parentFlag === 1">
              确定</el-button>
            <el-button class="commonButton" @click.native="submitEditCanteenForm('addCanteenForm')"
              v-if="parentFlag === 2">确定</el-button>
            <el-input class="commonInput" v-model="addCanteenForm.id" type="hidden"></el-input>
            <el-input class="commonInput" v-model="addCanteenForm.organizationId" type="hidden"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import axios from 'axios';
import BMap from 'vue-baidu-map';
// import Vue from 'vue';
// Vue.use(BaiduMap, {
//     // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//     ak: 'Dw09ZpZG9VGhwlzHjwMp5ogOuEx9uAFO',
// });
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'	
// import BMap from 'BMap';
export default {
  props: ['parentDialogVisible', 'parentFlag', 'setActive', 'parentActiveName', 'parentCurrentCateen', 'parentCurrentOrgan', 'treeNode', 'getMenus', 'getOrganizationPageList', 'getCanteens', 'getCanteensData', 'defaultPages', 'isorg', 'changeCateenPageSize', 'changeCateenPageIndex'],
  components: {
    BMap
  },
  data () {
    let validateMobile = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
      if (!value) {
        return callback(new Error('联系电话不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('联系电话格式不正确'))
          }
        }
      }, 100)
    }
    return {
      loading: false,
      mapHeight: 200 + "px",
      imgUrl: window.$imgUrl,
      visible: false,
      company: '孚谷餐饮有限公司',
      active: 'first',
      options: [{
        value: 1,
        label: 'AI智能模式'
      }, {
        value: 2,
        label: 'RFID智盘'
      }, {
        value: 3,
        label: '人脸识别自助'
      }],
      addOrgnForm: {

      },
      rules: {
        organizationName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      addCanteenForm: {

      },
      canteenRules: {
        restaurantName: [
          { required: true, message: '请输入食堂名称', trigger: 'blur' }
        ],
        patternType: [
          { required: true, message: '请选择业务模式', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入就餐人数', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入食堂地址', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入食堂负责人', trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      imageUrl: '',
      userId: 0,
      userName: '',
      datas: {},
      userlocation: { lng: "", lat: "" },
      map: null,
      geoc: null,
      mapGetshow: true,
      mapPointName: "",
      restaurantObj: {}, // 食堂对象
    }
  },
  computed: {
    cateenInfo () {
      return this.$store.state.Account.cateenInfo
    }
  },
  mounted () {
    this.visible = true;
    //console.log(this.treeNode);
    this.init();
    this.initUserInfo();
    let that = this;
    this.$nextTick(() => {
      this.mapBuild();
    })
  },
  methods: {
    // 输入大于0 的验证
    onInput0 (e) {
      this.$message.closeAll();
      if (e.target.value < 0) {
        this.$message.warning("只能输入大于0的数");
        e.target.value = null;
      }
    },
    //地图显示
    mapBuild () {
      let that = this;
      // setTimeout(function() {
      //if (that.mapGetshow) {
      try {
        this.map = new BMapGL.Map("map");
        this.geoc = new BMapGL.Geocoder();
        let point = new BMapGL.Point(113.07298735689024, 28.221947752559746);
        this.map.centerAndZoom(point, 15);
        this.map.enableScrollWheelZoom(true);
        // let geolocation = new BMapGL.Geolocation();
        //定位
        // geolocation.getCurrentPosition(
        //     () => {
        let mk = new BMapGL.Marker(point);
        this.map.addOverlay(mk);
        this.map.panTo(point);
        this.geoc.getLocation(point, function (rs) {
          let addComp = rs.addressComponents;
          console.log(rs);
          that.mapPointName =
            addComp.province +
            addComp.city +
            addComp.district +
            addComp.street +
            addComp.streetNumber;
          // that.loading = false;
          // that.mapGetshow = false;
        });
        //     },
        //     { enableHighAccuracy: true }
        // );
      } catch (error) {
        return Promise.reject(error);
      }
      //  }
      // }, 1000);
    },
    //搜索地图
    mapNameChange () {

      let that = this,
        point,
        marker = null;
      let local = new BMapGL.LocalSearch(this.map, {
        renderOptions: { map: this.map },
        onSearchComplete: res => {
          if (local.getResults() != undefined) {
            this.map.clearOverlays(); //清除地图上所有覆盖物
            if (local.getResults().getPoi(0)) {
              point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
              console.log(point)

              this.map.centerAndZoom(point, 15);
              marker = new BMapGL.Marker(point); // 创建标注
              this.map.addOverlay(marker); // 将标注添加到地图中
              // marker.enableDragging(); // 可拖拽
              this.geoc.getLocation(point, function (rs) {
                let addComp = rs.addressComponents;
                console.log(addComp);
                that.mapPointName =
                  addComp.province +
                  ", " +
                  addComp.city +
                  ", " +
                  addComp.district +
                  ", " +
                  addComp.street +
                  ", " +
                  addComp.streetNumber;

              });
              //鼠标点击
              this.map.addEventListener("click", function (e) {
                let pt = e.point;
                 that.mapPointName =
                    addComp.province +
                    addComp.city +
                    addComp.district +
                    addComp.street +
                    addComp.streetNumber;
                    console.log(pt, that.mapPointName);
                // that.map.clearOverlays();
                // let marker = new BMapGL.Marker(pt); // 创建标注
                // that.map.addOverlay(marker);
                // that.geoc.getLocation(pt, function(rs) {
                //     let addComp = rs.addressComponents;
                //     that.mapPointName =
                //     addComp.province +
                //     addComp.city +
                //     addComp.district +
                //     addComp.street +
                //     addComp.streetNumber;
                //     debugger
                // });
                // let gthat = this;
                // let geolocation = new BMapGL.Geolocation(); //创建geolocation实例，返回用户当前的位置
                // 开启SDK辅助定位
                // that.geoc.enableSDKLocation();
                // that.geoc.getCurrentPosition(function (r) { //返回用户当前位置。当定位成功时，回调函数的参数为GeolocationResult对象，否则为null
                //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                //     sessionStorage.setItem("SDKLng", pt.lng);
                //     sessionStorage.setItem("SDKLat", pt.lat);
                //     axios({
                //       method: 'post',
                //       url: 'http://api.map.baidu.com/geocoder/v2/?ak=Ya2nSaqjT3vNrIgba1v4nfWzSxGdtgZD&location=' + pt.lat + ',' + pt.lng + '&output=json',
                //       dataType: 'jsonp',
                //       callback: 'BMap._rd._cbk43398'
                //     }).then(rsp => {
                //       // debugger
                //       //  var result = res.result,
                //       //         addressComponent = result.addressComponent,
                //       //         adcode = addressComponent.adcode
                //     })
                //       .catch(err => console.log(err));

                //   }
                //   else {
                //     alert('failed' + this.getStatus());
                //   }
                // }, { enableHighAccuracy: true });
              });
            } else {
              this.$message.closeAll();
              this.$message({
                message: "未匹配到地点!可拖动地图上的红色图标到精确位置",
                type: 'warn'
              });
            }
          } else {
            this.$message.closeAll();
            this.$message({
              message: "未找到搜索结果",
              type: 'warn'
            });
          }
        }
      });
      local.search(this.addCanteenForm.address);
    },
    // 获取地图
    getMap (addr) {

      // console.log(BMapGL);
      // var map = new BMapGL.Map('map'); // 创建Map实例
      // map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
      // map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      let th = this;

      // // 创建Map实例
      // let map = new BMapGL.Map("map");
      // 初始化地图,设置中心点坐标，
      // let point = new BMapGL.Point(113.07298735689024, 28.221947752559746); 
      // 创建点坐标，获得公司的经纬度坐标
      // map.centerAndZoom(point, 15);
      // map.enableScrollWheelZoom();

      //建立一个自动完成的对象
      let ac = new BMapGL.Autocomplete({
        "input": "suggestId",
        "location": this.map
      })
      console.log(ac);
      let myValue = "";
      //鼠标点击下拉列表后的事件
      ac.addEventListener("onconfirm", function (e) {
        let _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        this.addCanteenForm.address = myValue
        setPlace();
      });

      function setPlace () {
        //清除地图上所有覆盖物
        this.map.clearOverlays();
        function myFun () {
          //获取第一个智能搜索的结果
          th.userlocation = local.getResults().getPoi(0).point;
          this.map.centerAndZoom(th.userlocation, 18);
          //添加标注
          this.map.addOverlay(new BMapGL.Marker(th.userlocation));
        }

        //智能搜索
        var local = new BMap.LocalSearch(this.map, {
          renderOptions: { map: this.map, panel: "r-result" }
        });

        local.search(addr);

        //测试输出坐标（指的是输入框最后确定地点的经纬度）
        this.map.addEventListener("click", function (e) {
          //经度
          console.log(th.userlocation.lng);
          //维度
          console.log(th.userlocation.lat);
        })
      }
    },
    initUserInfo () {
      const user = localStorage.getItem("userInfo");
      if(user) {
        this.userId = JSON.parse(user).userId;
        this.userName = JSON.parse(user).userName;
        this.datas.userId = this.userId;
      }
      this.datas.userName = 'zuzhi';
      this.datas.FileName = 'zuzhi';
      this.datas.type = 2;
      this.restaurantObj = this.cateenInfo;
      if (this.restaurantObj.id) {
        this.datas.restaurantId = this.restaurantObj.id;
        this.datas.restaurantName = this.restaurantObj.name;
      }
    },
    init () {
      this.active = this.parentActiveName;
      if (this.parentFlag === 2) {
        this.initFormData();  //输出：修改后的值
      } else {
        if (this.treeNode.isshitang == 1) {
          this.$message.closeAll();
          this.$message({
            message: '食堂不能添加下级',
            type: 'warn'
          });
          this.cancelModule(false);
        }
        this.addOrgnForm.parentName = this.treeNode.name;
        this.addOrgnForm.parentId = this.treeNode.id;
        this.addCanteenForm.organizationId = this.treeNode.id;
      }
      //debugger
    },
    //初始化表单
    initFormData () {
      // 组织
      this.addOrgnForm = JSON.parse(JSON.stringify(this.parentCurrentOrgan));
      // 食堂
      this.addCanteenForm = JSON.parse(JSON.stringify(this.parentCurrentCateen));
      if (this.parentActiveName === "second") {
        this.active = this.parentActiveName;

      } else {
        this.active = 'first';
      }
      if (this.addCanteenForm.pictures) {
        this.imageUrl = this.addCanteenForm.pictures;
        this.datas.sourcePath = this.imageUrl;
      }
    },
    //关闭弹框
    cancelModule (val) {
      this.$emit('cancelModule', val);
    },
    //添加组织
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.organizationSave();
        } else {
          //console.log('提交错误!');
          return false;
        }
      });
    },
    //编辑组织
    submitEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.orgaEditSave();
        } else {
          //console.log('提交错误!');
          return false;
        }
      });
    },
    //添加食堂
    submitCanteenForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.canteenSave();
        } else {
          //console.log('提交错误!');
          return false;
        }
      });
    },
    //编辑食堂
    submitEditCanteenForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.cantEditSave();
        } else {
          //console.log('提交错误!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleClick (tab, event) {
      //console.log(tab, event);
    },
    // 添加组织架构
    organizationSave () {
      //console.log('表单数据',this.addOrgnForm);

      const url = window.$config + `api/Organization/OrganizationSave`;
      axios({ method: 'post', url: url, data: this.addOrgnForm })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$message({
              message: '添加成功',
              type: 'success',
            });
            this.defaultPages.id = this.defaultPages.orgId;
            this.$emit('getMenus');
            this.$emit('getOrganizationPageList', this.defaultPages);
            this.cancelModule(false);
          } else {
            this.$message({
              message: rsp.data.message,
              type: 'error',
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑组织架构
    orgaEditSave () {
      //console.log(this.defaultPages);

      const url = window.$config + `api/Organization/OrganizationSave`;
      axios({ method: 'post', url: url, data: this.addOrgnForm })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success',
            });
            this.defaultPages.id = this.defaultPages.orgId;
            this.$emit('getOrganizationPageList', this.defaultPages);
            this.cancelModule(false);
          } else {
            this.$message({
              message: rsp.data.message,
              type: 'error',
            });
          }
        })
        .catch(err => console.log(err));
    },

    // 添加食堂
    canteenSave () {
      //console.log('表单数据',this.addCanteenForm)
      const url = window.$config + `api/Restaurant/RestaurantServiceSave`;
      axios({ method: 'post', url: url, data: this.addCanteenForm })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$message({
              message: '添加成功',
              type: 'success',
            });
            console.log(this.getCanteensData);
            this.$emit('getCanteens', this.getCanteensData);
            this.cancelModule(false);
          } else {
            this.$message({
              message: rsp.data.message,
              type: 'error',
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑食堂
    cantEditSave () {
      //console.log('表单数据',this.getCanteensData);
      const url = window.$config + `api/Restaurant/RestaurantServiceSave`;
      axios({ method: 'post', url: url, data: this.addCanteenForm })
        .then(rsp => {
          if (rsp.data.status == 1) {
            this.$message({
              message: '编辑成功',
              type: 'success',
            });
            //console.log(this.getCanteensData);
            if (this.getCanteensData.isshitang) {
              this.getCanteensData.id = this.getCanteensData.id;
            } else {
              this.getCanteensData.id = this.getCanteensData.orgId;
            }
            this.$emit('getCanteens', this.getCanteensData);
            this.cancelModule(false);
          } else {
            this.$message({
              message: rsp.data.message,
              type: 'error',
            });
          }
        })
        .catch(err => console.log(err));
    },

    handleAvatarSuccess (res, file) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      this.imageUrl = window.$imgUrlPrev + res.result;
      this.datas.sourcePath = this.imageUrl;
      this.addCanteenForm.pictures = this.imageUrl;
    },
    // 封装一个判断图片文件后缀名的方法
    isImage (fileName) {
      if (typeof fileName !== 'string') return;
      let name = fileName.toLowerCase();
      return name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.jpe') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.bmp');
    },
    beforeAvatarUpload (file) {
      this.loading = true;
      const isLt10M = file.size / 1024 / 1024 < 10;

      let type = this.isImage(file.name);
      this.$message.closeAll();
      if (!type) {
        this.$message.error('只允许上传.jpg,.gif,.jpe,.jpeg,.png,.bmp图片');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
        return false;
      }
      return true;
    },
  },
  watch: {
    parentCurrentOrgan: {
      handler: function (newValue, oldValue) {
        if (newValue != oldValue) {
          this.init();
        }

      },
      deep: true
    },
    parentCurrentCateen: {
      handler: function (newValue, oldValue) {
        if (newValue != oldValue) {
          this.init();
        }
      }, deep: true
    },
    cateenInfo: {
      handler (newValue) {
        this.restaurantObj = newValue;
        this.datas.restaurantId = this.restaurantObj.id;
        this.datas.restaurantName = this.restaurantObj.name;
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.map {
    width: 200px;
    height: 200px;
    min-height: 200px;
    border: 1px solid #c0c4cc;
}
</style>