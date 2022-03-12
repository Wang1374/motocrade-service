import request from '@/utils/request'
const baseReceipUrl = '/order/v1/receip/'

// 通过客户id查询客户账户列表
export function listReceip(customerId) {
  return request({
    url: baseReceipUrl + 'receipList/' + customerId,
    method: 'get'
  })
}

// 新增客户账户
export function addReceip(data) {
  return request({
    url: baseReceipUrl,
    method: 'post',
    data: data
  })
}

// 修改客户账户
export function updateReceip(data) {
  return request({
    url: baseReceipUrl,
    method: 'put',
    data: data
  })
}

//删除账户信息
export function deleteReceip(id) {
  return request({
    url: baseReceipUrl + id,
    method: 'delete'
  })
}