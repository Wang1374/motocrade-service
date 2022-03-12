import request from '@/utils/request'

const baseClientUrl = '/auth/v1/client/'

// 查询终端列表
export function listClient(query) {
    return request({
        url: baseClientUrl + 'clientList',
        method: 'get',
        params: query
    })
}

// 新增客户端
export function addClient(obj) {
    return request({
        url: baseClientUrl,
        method: 'post',
        data: obj
    })
}

// 修改客户端
export function updateClient(obj) {
    return request({
        url: baseClientUrl,
        method: 'put',
        data: obj
    })
}

// 删除客户端
export function delClient(id) {
    return request({
        url: baseClientUrl + id,
        method: 'delete'
    })
}

// 批量删除客户端
export function delAllClient(obj) {
    return request({
        url: baseClientUrl + 'deleteAll',
        method: 'post',
        data: obj
    })
}
