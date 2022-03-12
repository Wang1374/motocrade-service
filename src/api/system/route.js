import request from '@/utils/request'

const baseRouteUrl = '/route/v1/route/'

// 查询路由列表
export function listRoute(query) {
    return request({
        url: baseRouteUrl + 'routeList',
        method: 'get',
        params: query
    })
}

// 新增路由
export function addRoute(obj) {
    return request({
        url: baseRouteUrl,
        method: 'post',
        data: obj
    })
}

// 修改路由
export function updateRoute(obj) {
    return request({
        url: baseRouteUrl,
        method: 'put',
        data: obj
    })
}

// 删除路由
export function delRoute(id) {
    return request({
        url: baseRouteUrl + id,
        method: 'delete'
    })
}

// 批量删除路由
export function delAllRoute(obj) {
    return request({
        url: baseRouteUrl + 'deleteAll',
        method: 'post',
        data: obj
    })
}

// 刷新路由
export function refresh() {
    return request({
        url: baseRouteUrl + 'refresh',
        method: 'get'
    })
}
