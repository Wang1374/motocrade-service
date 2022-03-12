import request from '@/utils/request'
const baseContactwayUrl = '/order/v1/contactWay/'

// 根据客户id查询客户联系方式列表
export function listContactway(customerId) {
  return request({
    url: baseContactwayUrl + 'contactWayList/' + customerId,
    method: 'get'
  })
}

// 新增客户联系方式
export function addContactway(data) {
  return request({
    url: baseContactwayUrl,
    method: 'post',
    data: data
  })
}

// 修改客户联系方式
export function updateContactway(data) {
  return request({
    url: baseContactwayUrl,
    method: 'put',
    data: data
  })
}



//删除联系人信息
export function deleteContactway(id) {
  return request({
    url: baseContactwayUrl + id,
    method: 'delete'
  })
}