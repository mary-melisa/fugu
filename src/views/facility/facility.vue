<!-- 设备管理 -->
<template>
    <div class="facility">
        <div class="position">设备管理/设备管理</div>
        <el-row  class="operBtns">
            <facilityAdd />
            <!-- <facilityUpdate :facilitySelectId="facilitySelectId" />
            <facilityDel :facilitySelectId="facilitySelectId" /> -->
            <!-- <el-button  icon="el-icon-edit">编辑</el-button>
            <el-button  icon="el-icon-delete">删除</el-button> 
            <el-button  icon="el-icon-delete">批量停用</el-button>-->
        </el-row>
        <div class="organizationlContent">
          <div class="tableContent">
              <el-table
                  ref="multipleTable"
                  :data="facilityData"
                  class="commonTable"
                  tooltip-effect="dark"
                  height="100%"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
                  <el-table-column
                      type="selection"
                      width="55">
                  </el-table-column>
                  <el-table-column
                      prop="EquipmentId"
                      label="设备类型"
                      width="120">
                  </el-table-column>
                  <el-table-column
                      prop="FacilityName"
                      label="设备名称"
                      width="140">
                  </el-table-column>
                  <el-table-column
                      prop="Ip"
                      label="IP地址"
                      width="160"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="FacilityAddress"
                      label="设备地址"
                      width="180"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="FacilityStatus"
                      label="设备状态"
                      width="105"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="FacilitySN"
                      label="设备SN"
                      width="275"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="UserName"
                      label="负责人"
                      width="120"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="Mobile"
                      label="联系方式"
                      width="140"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="FacilityPictures"
                      label="设备照片"
                      width="auto"
                  >
                  </el-table-column>
              </el-table>
          </div>
          <div class="pagination">
              <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="getFacilityData.PageIndex"
                  @size-change="handleSizeChange"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pagination.defaultPageSize"
                  layout="total,sizes, prev, pager, next, jumper"
                  :total="pagination.total">
              </el-pagination>
          </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import facilityAdd from "./components/facilityAdd.vue";
// import facilityUpdate from "/components/facilityUpdate.vue";
// import facilityDel from "@/components/facilityDel.vue";
export default {
   components: {
      facilityAdd,
      // facilityUpdate,
      // facilityDel,
    },
    data() {
        return {
            getFacilityData: {
              PageIndex: 1,
              PageSize: 10,
              RestaurantId: 1,
            },
            pagination: {
              total: 0,
              defaultPageSize: 10,
            },
            facilityData: [],
            facilitySelectId: [],
            multipleSelection: []
        };
    },
    mounted() {
        this.getFacilitySelectPaging(this.getFacilityData);
    },
     methods: {
      handleNodeClick(data) {
          debugger
        console.log(data);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
      },
      getFacilitySelectPaging(data) {
            const url = `http://fuguapi.free.idcfengye.com/api/Facility/FacilitySelectPaging`;
            axios({ method: 'post', url: url ,data: data })
                .then(res => {
                    if (res.data.status == 1) {
                        console.log(res);
                        this.facilityData = res.data.result;
                        this.pagination.total = res.data.toTalCount;
                    } else {
                        console.log('获取设备列表错误！');
                        this.$alert('获取设备列表错误', '提示', {
                            confirmButton: '确定',
                            type: 'error',
                        });
                    }
                })
                .catch(err => console.log(err));
      },
      handleSizeChange(val) {
        this.getFacilityData.PageIndex = 1;
        this.getFacilityData.PageSize = val;
        this.getFacilitySelectPaging(this.getFacilityData);
      },
      handleCurrentChange(val) {
        this.getFacilityData.PageIndex = val;
        this.getFacilitySelectPaging(this.getFacilityData);
      }
    }
};
</script>

<style scoped lang="scss">
.facility {
    width: 100%;
    height: 100%;
    @include flex();
    flex-direction: column;

    .position {
        padding: 20px 20px 10px;
        height: 30px;
        font-size: 16px;
        color: black;
    }
    .operBtns {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #BBBBBB;
        .el-button {
            color: #1890FF;
            border: 0;
        }
    }
    .organizationlContent {
        width: 100%;
        height: calc(100% - 70px);
        .tableContent {
            width: 100%;
            height: calc(100% - 75px);
        }
        .pagination {
            width: 100%;
            height: 60px;
            .el-pagination {
                padding-top: 16px;
            }
        }
    }
}
</style>
