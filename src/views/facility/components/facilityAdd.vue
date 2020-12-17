<template>
  <div class="facilityAdd">
    <el-button  icon="el-icon-plus">添加</el-button>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
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
        facilityType: {},
        facilityName: {},
        form: {
          FacilityName: undefined,
          EquipmentId: undefined,
          Ip: "",
          FacilityStutas: undefined,
          FacilityAddress: "",
          FacilitySN: "",
          UserName: "",
          Mobile: "",
          FacilityPictures:""
        },
      }
    },
    created() {
        let data = {
          PageIndex: 1,
          PageSize: 20,
        };
        etEquipmentId(data)
          .then((res) => {
            this.facilityType = res.data.result;
          })
          .catch((error) => {
            console.log("发生错误！", error);
          });
      },
      methods: {
        showModal() {
          this.visible = true;
        },
        getFacilityAdd(data) {
          facilityAdd(data)
            .then((res) => {
              if (res.data.status === 1) {
                this.$message.success("设备添加成功！");
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((error) => {
              console.log("发生错误！", error);
            });
        },
        handleChangeEquipmentId(e, v) {
          let data = {
            id: v.data.key,
          };
          maintenanceRecordSelectName(data)
            .then((res) => {
              this.facilityName = res.data.result;
            })
            .catch((error) => {
              console.log("发生错误！", error);
            });
          this.form.EquipmentId = v.data.key;
        },
        handleChangeFacilityName(e, v) {
          this.form.FacilityName = v.data.key;
        },
        handleChangeFacilityStatus(e, v) {
          this.form.FacilityStatus = v.data.key;
        },
        imageAddress(imageAddress) {
            // childValue就是子组件传过来的值
            console.log(imageAddress)
            this.form.FacilityPictures = imageAddress;
            console.log(this.form)
        },
        dialogFormVisible() {
          this.getFacilityAdd(this.form);
          this.confirmLoading = true;
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
          }, 2000);
        },
        dialogFormVisible(e) {
          console.log(e);
          this.visible = false;
        },
      },
  }
</script>

<style scoped lang="scss">
  .el-button {
      color: #1890FF;
      border: 0;
  }
</style>
