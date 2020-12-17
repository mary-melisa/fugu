/**
 * Excel导出工具类
 */
import moment from 'moment';
import bus from '@/business/globalApplication';
import constantsUtils from '@/constants/constantsUtils';

class ExcelUtil {
    constructor() {
        this.uri = 'data:application/vnd.ms-excel;base64,';
        this.tmplWorkbookXML = ['<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>', '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">', '   <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">', '       <Author>Axel Richter</Author>', '       <Created>{created}</Created>', '   </DocumentProperties>', '   <Styles>', '       <Style ss:ID="HeadStyle"><Alignment ss:Horizontal="Center" ss:Vertical="Center" /></Style>', '       <Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>', '       <Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>', '       <Style ss:ID="StringStyle"><Alignment ss:Vertical="Center" /></Style>', '   </Styles>', '{worksheets}</Workbook>'].join('');
        this.tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>';
        this.tempCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>';
        this.base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        };
        this.format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            });
        };
    }

    /*
     * 简单Excel导出(只支持单个表格)
     * param.tableId tableId
     * param.sheetName sheet名称
     * param.excelName excel名称
     */
    exportSimpleExcel(param) {
        // 获取table
        let table = document.querySelector('#' + param.tableId);
        let rowsXML = [];
        // 表头
        let headerList = table.querySelectorAll('.el-table__header-wrapper thead th');
        if (headerList && headerList.length > 0) {
            rowsXML.push('<Row>');
            for (let item of headerList) {
                rowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.innerText}</Data></Cell>`);
            }
            rowsXML.push('</Row>');
        }
        // 表内容
        let bodytr = table.querySelectorAll('.el-table__body-wrapper tr');
        if (bodytr && bodytr.length > 0) {
            for (let tr of bodytr) {
                rowsXML.push('<Row>');
                let tds = tr.querySelectorAll('td div');
                for (let td of tds) {
                    rowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${td.innerHTML}</Data></Cell>`);
                }
                rowsXML.push('</Row>');
            }
        }
        let wsparam = {
            rows: rowsXML.join(''),
            nameWS: param.sheetName || 'Sheet0',
        };
        let worksheetsXML = this.format(this.tmplWorksheetXML, wsparam);
        let wbparam = {
            created: new Date().getTime(),
            worksheets: worksheetsXML,
        };
        let workbookXML = this.format(this.tmplWorkbookXML, wbparam);

        // 创建隐藏a标签
        let eleLink = document.createElement('a');
        eleLink.style.display = 'none';
        eleLink.href = this.uri + this.base64(workbookXML);
        eleLink.download = param.excelName || '导出_' + moment().format('YYYYMMDD');
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);

        return;
    }

    /*
     * 简单Excel导出(多个表格)
     * param.sheetList [
     *       tableId tableId
     *       sheetName sheet名称
     * ]
     * param.excelName excel名称
     */
    exportMuchSimpleExcel(param) {
        if (param.sheetList && param.sheetList.length > 0) {
            let worksheetsXML = '';
            param.sheetList.forEach(item => {
                // 获取table
                let table = document.querySelector('#' + item.tableId);
                let rowsXML = [];
                // 表头
                let headerList = table.querySelectorAll('.el-table__header-wrapper thead th');
                if (headerList && headerList.length > 0) {
                    rowsXML.push('<Row>');
                    for (let item of headerList) {
                        rowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.innerText}</Data></Cell>`);
                    }
                    rowsXML.push('</Row>');
                }
                // 表内容
                let bodytr = table.querySelectorAll('.el-table__body-wrapper tr');
                if (bodytr && bodytr.length > 0) {
                    for (let tr of bodytr) {
                        rowsXML.push('<Row>');
                        let tds = tr.querySelectorAll('td div.cell');
                        for (let td of tds) {
                            rowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${td.innerHTML}</Data></Cell>`);
                        }
                        rowsXML.push('</Row>');
                    }
                }

                let wsparam = {
                    rows: rowsXML.join(''),
                    nameWS: item.sheetName,
                };
                worksheetsXML += this.format(this.tmplWorksheetXML, wsparam);
            });
            let wbparam = {
                created: new Date().getTime(),
                worksheets: worksheetsXML,
            };
            let workbookXML = this.format(this.tmplWorkbookXML, wbparam);

            // 创建隐藏a标签
            let eleLink = document.createElement('a');
            eleLink.style.display = 'none';
            eleLink.href = this.uri + this.base64(workbookXML);
            eleLink.download = param.excelName;
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);

            return;
        }
    }

    /*
     * 导出持仓Excel
     * param.holderSum 持仓汇总列表
     * param.holderDetail 持仓明细列表
     */
    exportHolderExcel(param) {
        let worksheetsXML = '';
        // 格式化价格
        const formatAmount = (value, num = 2) => {
            if (value !== null && value !== '' && value !== undefined) {
                return Number(value).toFixed(num);
            } else {
                return Number(0).toFixed(num);
            }
        };
        // 格式化价格
        const formatDateTime = (value, format = 'YYYY-MM-DD HH:mm:ss') => {
            return moment(value).format(format);
        };
        // 获取价格
        const getPrice = (goodsCode, name) => {
            let good = bus.goodsManager.goodsInfos.find(x => x.GoodsCode === goodsCode);
            if (good) {
                return good.MoGoodsQuotaInfo[name];
            } else {
                return 0;
            }
        };
        // 平仓量
        const getQty = item => {
            return item.OpenQty - item.HolderQty;
        };
        // 格式化成交类型
        const formatTradeType = item => {
            if (item.TradeType) {
                return constantsUtils.getInforTradeType(item.TradeType);
            } else {
                return constantsUtils.getInforTradeType(item.HisTradeType);
            }
        };
        // 持仓汇总
        let holderSumRowsXML = [];
        // 持仓汇总表头
        holderSumRowsXML.push('<Row>');
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">合约</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">方向</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">持仓</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">可用</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">开仓均价</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">浮动盈亏</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">保证金</Data></Cell>`);
        holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">名称</Data></Cell>`);
        holderSumRowsXML.push('</Row>');
        // 持仓汇总表内容
        if (param.holderSum && param.holderSum.length > 0) {
            for (let item of param.holderSum) {
                holderSumRowsXML.push('<Row>');
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.GoodsCode}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.BuyOrSell === 0 ? '买' : '卖'}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.CurPositionQty}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.AvailQty}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.OpenAVGPrice, item.DecimalPlace)}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.DynProfit, item.DecimalPlace)}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.UsedMargin, item.DecimalPlace)}</Data></Cell>`);
                holderSumRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.GoodsName}</Data></Cell>`);
                holderSumRowsXML.push('</Row>');
            }
        }
        let holderSumWSParam = {
            rows: holderSumRowsXML.join(''),
            nameWS: '持仓汇总',
        };
        worksheetsXML += this.format(this.tmplWorksheetXML, holderSumWSParam);

        // 持仓明细
        let holderDetailRowsXML = [];
        // 持仓明细表头
        holderDetailRowsXML.push('<Row>');
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">开仓日期</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">合约</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">买卖</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">持仓量</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">可用量</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">开仓价</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">成交类型</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">撮合编号</Data></Cell>`);
        // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">持仓盯市盈亏</Data></Cell>`);
        // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">持仓浮动盈亏</Data></Cell>`);
        // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">盯市平仓盈亏</Data></Cell>`);
        // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">平仓浮动盈亏</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">持仓价</Data></Cell>`);
        holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">最新价</Data></Cell>`);
        holderDetailRowsXML.push('</Row>');
        // 持仓明细表内容
        if (param.holderDetail && param.holderDetail.length > 0) {
            for (let item of param.holderDetail) {
                holderDetailRowsXML.push('<Row>');
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatDateTime(item.TradeTime)}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.GoodsCode}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.BuyOrSell === 0 ? '买' : '卖'}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.HolderQty}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${getQty(item)}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${item.OpenPrice}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatTradeType(item)}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${String(item.TradeID)}</Data></Cell>`);
                // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.MarkToMarketDynProfit, item.DecimalPlace)}</Data></Cell>`);
                // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.EachDynProfit, item.DecimalPlace)}</Data></Cell>`);
                // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.InforClosePL2, item.DecimalPlace)}</Data></Cell>`);
                // holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.InforClosePL4, item.DecimalPlace)}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(item.HolderPrice, item.DecimalPlace)}</Data></Cell>`);
                holderDetailRowsXML.push(`<Cell ss:StyleID="StringStyle"><Data ss:Type="String">${formatAmount(getPrice(item.GoodsCode, 'Last'), item.DecimalPlace)}</Data></Cell>`);
                holderDetailRowsXML.push('</Row>');
            }
        }
        let holderDetailWSParam = {
            rows: holderDetailRowsXML.join(''),
            nameWS: '持仓明细',
        };
        worksheetsXML += this.format(this.tmplWorksheetXML, holderDetailWSParam);

        let wbparam = {
            created: new Date().getTime(),
            worksheets: worksheetsXML,
        };
        let workbookXML = this.format(this.tmplWorkbookXML, wbparam);
        // 创建隐藏a标签
        let eleLink = document.createElement('a');
        eleLink.style.display = 'none';
        eleLink.href = this.uri + this.base64(workbookXML);
        eleLink.download = '持仓单';
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }
}

const excelUtil = new ExcelUtil();
export default excelUtil;
