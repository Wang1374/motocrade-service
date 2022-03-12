import request from '@/utils/request'
const baseMineOrderUrl = '/distribute/v1/mineOrder/'

//查询我的订单
export function getMineOrderList(query) {
  return request({
    url: baseMineOrderUrl,
    method: 'get',
    params: query
  })
}

