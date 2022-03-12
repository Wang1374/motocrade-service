import request from '@/utils/request'
const baseConstantOrderUrl = '/order/v1/constant/'


// 获取全部船名
export function getAllShipsName() {
    return request({
        url: baseConstantOrderUrl + 'allShipsName',
        method: 'get'
    })
}

//添加船名
export function addShipName(data) {
    return request({
        url: baseConstantOrderUrl + 'addShipName',
        method: 'post',
        data: data
    })
}
// 获取船公司列表
export function getAllShipCompany() {
    return request({
        url: baseConstantOrderUrl + 'allShipCompany',
        method: 'get'
    })
}

// 获取码头列表
export function getDockList() {
    return request({
        url: baseConstantOrderUrl + 'dockList',
        method: 'get'
    })
}

// 获取箱型列表
export function getBoxPileList() {
    return request({
        url: baseConstantOrderUrl + 'boxPileList',
        method: 'get'
    })
}
