import request from '@/utils/request'
const baseOrderNumberUrl = '/order/v1/orderNumber/'

export function getOrderNumber(corporateIdentify) {
    return request({
        url: baseOrderNumberUrl + 'getOrderNumber/' + corporateIdentify,
        method: 'get'
    })
}

// 更新订单编号设置
export function updateOrderNumber(data) {
    return request({
        url: baseOrderNumberUrl,
        method: 'put',
        data: data
    })
}
