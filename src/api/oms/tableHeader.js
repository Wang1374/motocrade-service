import request from '@/utils/request'
const baseBusinessOrderUrl = '/order/v1/tableHeader/'


//获取表头数据
export function orderHeader(query) {
    return request({
        url: baseBusinessOrderUrl + 'getHeader',
        method: 'get',
        params: query
    })
}
//新增操作
export function insertTableHeader(data) {
    return request({
        url: baseBusinessOrderUrl + 'insertHeader',
        method: 'post',
        data: data
    })
}
//修改表头数据
export function saveTableHeader(obj) {
    return request({
        url: baseBusinessOrderUrl + 'saveTableHeader',
        method: 'post',
        data: obj
    })
}