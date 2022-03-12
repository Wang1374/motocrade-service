import request from '@/utils/request'
const baseDriverUrl = '/order/v1/driver/'

//新增司机
export function addDriver(data) {
    return request({
        url: baseDriverUrl,
        method: 'post',
        data: data
    })
}

//查询司机信息
export function listDriver(query) {
    return request({
        url: baseDriverUrl + 'driverList',
        method: 'get',
        params: query
    })
}

//根据id删除司机信息
export function delDriver(id) {
    return request({
        url: baseDriverUrl + id,
        method: 'delete'
    })
}

//批量删除司机信息
export function deleteAllByIds(obj) {
    return request({
        url: baseDriverUrl + 'driverAll',
        method: 'post',
        data: obj
    })
}

//编辑司机信息
export function updateDriver(data) {
    return request({
        url: baseDriverUrl + 'updateDriver',
        method: 'post',
        data: data
    })
}

// 获取司机与联系方式
export function getDriverAndContact(corporateIdentify) {
    return request({
        url: baseDriverUrl + 'getDriverAndContact/' + corporateIdentify,
        method: 'get'
    })
}
