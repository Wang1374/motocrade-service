import request from '@/utils/request'
const baseGuaranteeUrl = '/order/v1/carGuarantee/'

//新增保险费用记录
export function addCarGuarantee(data) {
    return request({
        url: baseGuaranteeUrl,
        method: 'post',
        data: data
    })
}

//查询保险费用记录
export function getCarGuarantee(query) {
    return request({
        url: baseGuaranteeUrl + 'getCarGuarantee',
        method: 'get',
        params: query
    })
}

//修改保险费用记录
export function editCarGuarantee(data) {
    return request({
        url: baseGuaranteeUrl,
        method: 'put',
        data: data
    })
}

//根据id删除保险费用记录
export function deleteCarGuarantee(id) {
    return request({
        url: baseGuaranteeUrl + id,
        method: 'delete'
    })
}