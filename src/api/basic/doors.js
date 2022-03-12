import request from '@/utils/request'
const baseDoorsUrl = '/order/v1/doors/'

// 查询门点列表
export function listDoors(query) {
  return request({
    url: baseDoorsUrl + 'doorsList',
    method: 'get',
    params: query
  })
}

// 新增门点
export function addDoors(data) {
  return request({
    url: baseDoorsUrl,
    method: 'post',
    data: data
  })
}

// 修改门点
export function updateDoors(data) {
  return request({
    url: baseDoorsUrl,
    method: 'put',
    data: data
  })
}

// 删除门点
export function delDoors(id) {
  return request({
    url: baseDoorsUrl + id,
    method: 'delete'
  })
}

//根据客户id查询门点信息
export function listDoorsway(customerId) {
  return request({
    url: baseDoorsUrl + 'doorsWay/' + customerId,
    method: 'get'
  })
}

