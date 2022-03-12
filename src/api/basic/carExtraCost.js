import request from '@/utils/request'
const baseExtraCostUrl = '/order/v1/extraCost/'

//新增车辆额外费用记录
export function saveExtraCost(data) {
    return request({
        url: baseExtraCostUrl,
        method: 'post',
        data: data
    })
}
//根据id修改车辆额外费用记录
export function editExtraCost(data) {
    return request({
        url: baseExtraCostUrl,
        method: 'put',
        data: data
    })
}
//查询车辆额外费用记录
export function getExtraCost(query) {
    return request({
        url: baseExtraCostUrl + 'getExtraCost',
        method: 'get',
        params: query
    })
}
export function deleteExtraCost(id) {
    return request({
        url: baseExtraCostUrl + id,
        method: 'delete'
    })
}

