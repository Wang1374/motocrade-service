import request from '@/utils/request'
const baseAccountUrl = '/order/v1/account/'

// 通过客户id查询客户账户列表
export function listAccount(customerId) {
  return request({
    url: baseAccountUrl + 'accountList/' + customerId,
    method: 'get'
  })
}

// 新增客户账户
export function addAccount(data) {
  return request({
    url: baseAccountUrl,
    method: 'post',
    data: data
  })
}

// 修改客户账户
export function updateAccount(data) {
  return request({
    url: baseAccountUrl,
    method: 'put',
    data: data
  })
}

//删除账户信息
export function deleteAccount(id) {
  return request({
    url: baseAccountUrl + id,
    method: 'delete'
  })
}