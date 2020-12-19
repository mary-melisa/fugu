<template>
  <div class="facilityAdd">
    <el-button  icon="el-icon-plus" @click="showDialog">添加</el-button>
    <el-dialog title="添加设备" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="设备类型" :label-width="formLabelWidth">
         <el-select v-model="form.EquipmentId" placeholder="请选择设备类型" @change="handleChangeEquipmentId">
           <el-option
             :label="item.equipmentName"
             v-for="item in facilityType"
             :key="item.id"
             :value="item.id">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-select v-model="form.FacilityName" placeholder="请选择设备名称" @change="handleChangeFacilityName">
            <el-option
              :label="item.facilityName"
              v-for="item in facilityName"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" :label-width="formLabelWidth">
          <el-input v-model="form.Ip"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" :label-width="formLabelWidth">
          <el-select v-model="form.FacilityStatus" placeholder="请选择设备状态" @change="handleChangeFacilityStatus">
            <el-option label="离线" key="0" value="0"></el-option>
            <el-option label="使用中" key="1" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备SN" :label-width="formLabelWidth">
          <el-input v-model="form.FacilitySN"></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="formLabelWidth">
          <el-input v-model="form.UserName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="form.Mobile"></el-input>
        </el-form-item>
        <el-form-item label="设备地址" :label-width="formLabelWidth">
          <el-input v-model="form.FacilityAddress"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设备图片" :label-width="formLabelWidth">
          <Upload v-on:imageAddress="imageAddress" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  //import Upload from "@/components/UploadImg/UploadImg";
  export default {
    components: {
        //Upload,
     },
    data(){
      return{
        dialogFormVisible:false,
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
        formLabelWidth: '120px'
      }
    },
    created() {
        let data = {
          PageIndex: 1,
          PageSize: 20,
        };
        this.getEquipmentId(data)
      },
      methods: {
        showDialog() {
          this.dialogFormVisible = true;
        },
        getEquipmentId(data) {
          const url = `http://webapi.free.idcfengye.com/api/bdequitype/getequitype`;
          axios({ method: 'post', url: url ,data: data })
              .then(res => {
                  if (res.data.status == 1) {
                      console.log(res);
                      this.facilityType = res.data.result;
                  } else {
                      console.log(res.data.message);
                      this.$alert('获取设备类型错误', '提示', {
                          confirmButton: '确定',
                          type: 'error',
                      });
                  }
              })
              .catch(err => console.log(err));
        },
        getFacilityAdd(data) {
          const url = `http://fuguapi.free.idcfengye.com/api/Facility/FacilityAdd`;
          axios({
            method: 'post',
            url: url ,
            data: data,
            })
              .then(res => {
                  if (res.data.status == 1) {
                      console.log(res);
                      this.$alert('设备添加成功', '提示', {
                          confirmButton: '确定',
                          type: 'error',
                      });
                      this.facilityData = res.data.result;
                      this.pagination.total = res.data.toTalCount;
                  } else {
                      console.log(res.data.message);
                      this.$alert('获取设备列表错误', '提示', {
                          confirmButton: '确定',
                          type: 'error',
                      });
                  }
              })
              .catch(err => console.log(err));
        },
        handleChangeEquipmentId(val) {
          let data = {
            id:val
          }
        const url = `http://fuguapi.free.idcfengye.com/api/MaintenanceRecord/MaintenanceRecordSelectName`;
          axios({method: 'post',url: url ,data: data,})
          .then(res => {
              if (res.data.status == 1) {
                  console.log(res);
                  this.facilityName = res.data.result;
              } else {
                  console.log(res.data.message);
              }
          })
          .catch(err => console.log(err));
          this.form.EquipmentId = val;
        },
        handleChangeFacilityName(val) {
          this.form.FacilityName = val;
        },
        handleChangeFacilityStatus(val) {
          console.log(val);
          this.form.FacilityStatus = val;
        },
        // imageAddress(imageAddress) {
        //     // childValue就是子组件传过来的值
        //     console.log(imageAddress)
        //     this.form.FacilityPictures = imageAddress;
        //     console.log(this.form)
        // },
        handleOk() {
          this.getFacilityAdd(this.form);
          setTimeout(() => {
            this.dialogFormVisible = false;
          }, 5000);
        },
        handleCancel() {
          this.dialogFormVisible = false;
        },
      },
  }
</script>

<style scoped lang="scss">
  .el-button {
      color: #1890FF;
      border: 0;
      float: left;
  }
</style>
