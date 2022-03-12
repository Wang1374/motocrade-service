import request from '@/utils/request'
const baseCarProfitUrl = '/order/v1/carProfit/'

// 查询
export function getCarProfit(query) {
    return request({
        url: baseCarProfitUrl + 'getCarProfit',
        method: 'get',
        params: query
    })
}

// 根据年份获取车辆平均每月利润
export function getMonthlyProfit(query) {
    return request({
        url: baseCarProfitUrl + 'getMonthlyProfit',
        method: 'get',
        params: query
    })
}