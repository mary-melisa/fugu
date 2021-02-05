<template>
        <div class="tableContent">
            <div class="content">
                <el-table
                    ref="multipleTable"
                    :data="newTableData"
                    class="commonTable"
                    tooltip-effect="dark"
                    height="100%"
                    style="width: 100%"
                    highlight-current-row
                    :span-method="objectSpanMethod"
                    show-summary
                    stripe
                    border>
                    <el-table-column
                        prop="dayInfo"
                        label="日期"
                        >
                    </el-table-column>

                    <el-table-column
                        prop="categoryName"
                        label="餐别"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="countinfo"
                        label="笔数"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="marketAmount"
                        label="营业额"
                    >
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
</template>

<script>
import moment from 'moment';
export default {
    props:['parentTableData', 'parentDefault', 'setCurrentMeal', 'setParentSelection'],
    data() {
        return {
            currentPage: 1,
            multipleSelection: [],
            // columnOptions: [{
            //     label: '餐别',
            //     prop: 'className'
            // },{
            //     label: '笔数',
            //     prop: 'cardNumber'
            // },{
            //     label: '营业额',
            //     prop: 'rushRedTime'
            // }]
            columnOptions: [],
            newTableData: [],
            spanArray: [],
            tableIndex: 0,
        }
    },
    mounted(){
        this.initData();
    },
    methods: {
        initData(){
            this.newTableData = [];
            this.spanArray = [];
            this.tableIndex = 0;
            if(this.parentTableData.result && this.parentTableData.result.list && this.parentTableData.result.list.length) {
                this.parentTableData.result.list.forEach(item => {
                    for(let i = 0; i < item.detailList.length; i++){
                        let obj = item.detailList[i];
                        let current = {
                            dayInfo: item.dayInfo,
                            categoryName: obj.categoryType,
                            countinfo: obj.countinfo,
                            marketAmount: obj.marketAmount
                        }
                        this.newTableData.push(current);
                    }
                })
                console.log(this.newTableData, '新数据');
                this.newTableData.forEach((item, index) => {
                    if(index === 0) {
                        this.spanArray.push(1);
                        this.tableIndex = 0;
                    }else {
                        if(item.dayInfo === this.newTableData[index - 1].dayInfo){
                            this.spanArray[this.tableIndex] = this.spanArray[this.tableIndex] + 1;
                            this.spanArray.push(0);
                        }else{
                            this.spanArray.push(1);
                            this.tableIndex = index;
                        }
                    }
                })
                console.log(this.spanArray,'spanArray')
                console.log(this.tableIndex, 'tableIndex')
            }
        },
        formateDate(date){
            return moment(date).format('YYYY/MM/DD');
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                let _row = this.spanArray[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            // else if (columnIndex === 1) {
            //     // columnIndex === 1 找到第二列，实现合并第2到4列
            //     for (let i = 0; i < this.spanArray.length; i++) {
            //         // 筛选数组中数值不是0的数
            //         if (this.spanArray[i] > 1) {
            //             // console.log(i, this.spanArr[i])
            //             // 发现的规律：当前索引 + 索引所对应的数值 - 1 = 所要合并的第几行
            //             if (rowIndex === (i + this.spanArray[i] - 1)) {
            //                 setTimeout(() => {
            //                     console.log(document.querySelectorAll(`tr:nth-of-type(${i + this.spanArray[i]})`), i + this.spanArray[i])
            //                     document.querySelectorAll(`tr:nth-of-type(${i + this.spanArray[i]}) td div`)[0].style.float = 'right'
            //                     // document.querySelectorAll(`tr:nth-of-type(${i + this.spanArray[i]}) td div`)[0].style.marginRight = '10%'
            //                 }, 0)
            //                 return {
            //                     rowspan: 1,
            //                     colspan: 3
            //                 }
            //             }
            //         }
            //     }
            // }
        }
    },
    watch: {
        parentTableData: {
            handler(newValue, oldValue) {
                if(newValue !== oldValue) {
                    this.initData();
                }
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
   .tableContent {
       width: 100%;
       height: 100%;
       .content {
           height: calc(100% - 40px);
           ::v-deep.commonTable.el-table {
               .el-table__body-wrapper {
                   height: auto !important;
               }
           }
       }
   }
</style>