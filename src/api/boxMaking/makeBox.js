import request from '@/utils/request'
const baseBoxMakingUrl = '/order/v1/boxMaking/'

// 查询做箱列表
export function listBoxMaking(query) {
  return request({
    url: baseBoxMakingUrl + 'boxMakingList',
    method: 'get',
    params: query
  })
}


// 查询客户端做箱列表
export function clientlistBoxMaking(query) {
  return request({
    url: baseBoxMakingUrl + 'clientBoxMakingList',
    method: 'get',
    params: query
  })
}