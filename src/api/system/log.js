import request from '@/utils/request'
const baseLogUrl = '/user/v1/log/'

// 根据订单编号获取日志信息
export function getOrderLog(orderNumber) {
    return request({
        url: baseLogUrl + 'getOrderLog/' + orderNumber,
        method: 'get'
    })
}
