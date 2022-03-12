import request from '@/utils/request'
const baseVehicleUrl = '/order/v1/vehicle/'


//新增车辆
export function addVehicle(data) {
    return request({
        url: baseVehicleUrl,
        method: 'post',
        data: data
    })
}

//分页查询车辆列表
export function listCars(query) {
    return request({
        url: baseVehicleUrl + 'carList',
        method: 'get',
        params: query
    })
}

//更新车辆信息
export function updateCar(data) {
    return request({
        url: baseVehicleUrl + 'updateCar',
        method: 'post',
        data: data
    })
}

//根据id删除车辆数据
export function delCar(id) {
    return request({
        url: baseVehicleUrl + id,
        method: 'delete'

    })
}

//批量删除车辆数据
export function deleteAllByIds(obj) {
    return request({
        url: baseVehicleUrl + 'deleteAllByIds',
        method: 'post',
        data: obj
    })
}

// // 获取车辆与默认司机
// export function getVehicleAndDriver(corporateIdentify) {
//     return request({
//         url: baseVehicleUrl + 'getVehicleAndDriver/' + corporateIdentify,
//         method: 'get'
//     })
// }

// 获取车辆与默认司机
export function getVehicleAndDriver(query) {
    return request({
        url: baseVehicleUrl + 'getVehicleAndDriver/',
        method: 'get',
        params:query
    })
}
