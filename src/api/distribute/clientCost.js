import request from '@/utils/request'
const baseClientCostUrl = '/distribute/v1/clientCost/'


//查询客户端费用
export function getClientCost(query) {
    return request({
        url: baseClientCostUrl + 'getClientCost',
        method: 'get',
        params: query
    })
}