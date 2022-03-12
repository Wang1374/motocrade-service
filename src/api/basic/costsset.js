import request from '@/utils/request'
const baseCostsSetUrl = '/order/v1/costsSet/'

// 查询费用设置列表
export function listCostsSet(query) {
    return request({
        url: baseCostsSetUrl + 'costsSetList',
        method: 'get',
        params: query
    })
}

// 新增费用
export function addCostsSet(data) {
    return request({
        url: baseCostsSetUrl,
        method: 'post',
        data: data
    })
}

// 修改费用
export function updateCostsSet(data) {
    return request({
        url: baseCostsSetUrl,
        method: 'put',
        data: data
    })
}

// 删除费用
export function delCostsSet(id) {
    return request({
        url: baseCostsSetUrl + id,
        method: 'delete'
    })
}

// 根据标识id查询费用参数信息
export function findCostsSet(belongCompaniesId) {
    return request({
        url: baseCostsSetUrl + 'findCostsSetList/' + belongCompaniesId,
        method: 'get'
    })
}
