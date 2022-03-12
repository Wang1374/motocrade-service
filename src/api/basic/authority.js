import request from '@/utils/request'
const baseAuthorityUrl = '/user/v1/authority/'

// 查询员工列表
export function listStaff(query) {
  return request({
    url: baseAuthorityUrl + 'staffList',
    method: 'get',
    params: query
  })
}
