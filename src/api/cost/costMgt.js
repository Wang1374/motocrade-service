import request from '@/utils/request'
const baseCostMgtUrl = '/order/v1/costMgt/'

// 通过企业标识id与订单编号 获取费用列表
export function getCostList(query) {
    return request({
        url: baseCostMgtUrl + 'getCostList',
        method: 'get',
        params: query
    })
}
//修改代垫发票url
export function setInvoiceUrlById(query) {
    return request({
        url: baseCostMgtUrl + 'setUrlById',
        method: 'put',
        params: query
    })
}


// 修改费用信息
export function updateCost(data) {
    return request({
        url: baseCostMgtUrl,
        method: 'put',
        data: data
    })
}

// 获取费用列表分页
export function getCostListPage(query) {
    return request({
        url: baseCostMgtUrl + 'costListPage',
        method: 'get',
        params: query
    })
}

// 根据费用id批量核销
export function batchUpdate(data) {
    return request({
        url: baseCostMgtUrl + 'batchUpdate',
        method: 'put',
        data: data
    })
}

//获取费用
export function getProfitList(query) {
    return request({
        url: baseCostMgtUrl + 'getProfit',
        method: 'get',
        params: query
    })
}

//根据往来单位获取费用
export function getbtypeProfitList(query) {
    return request({
        url: baseCostMgtUrl + 'getBtypeProfit',
        method: 'get',
        params: query
    })
}

//获取代垫发票url
export function getInvoiceUrl(query) {
    return request({
        url: baseCostMgtUrl + 'getInvoiceUrl',
        method: 'get',
        params: query
    })
}

// 导出费用明细
export function exportFees(data, type) {
    return request({
        url: baseCostMgtUrl + 'exportFees',
        method: 'post',
        responseType: 'arraybuffer',
        headers: { 'Download-Type': type },
        data: data
    })
}


//根据箱id获取箱毛利
export function getMakingProfit(mcId) {
    return request({
        url: baseCostMgtUrl + mcId,
        method: 'get'
    })
}