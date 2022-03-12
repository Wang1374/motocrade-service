import request from '@/utils/request'
const baseClientDoorsUrl = '/distribute/v1/clientDoors/'

//新增门点
export function addDoors(data) {
  return request({
    url: baseClientDoorsUrl,
    method: 'post',
    data: data
  })
}

// 查询门点列表
export function listDoors(query) {
  return request({
    url: baseClientDoorsUrl + 'doorsList',
    method: 'get',
    params: query
  })
}

// 修改门点
export function updateDoors(data) {
  return request({
    url: baseClientDoorsUrl,
    method: 'put',
    data: data
  })
}


// 删除门点
export function delDoors(query) {
  return request({
    url: baseClientDoorsUrl,
    method: 'delete',
    params: query
  })
}

//查询所有的门点
export function getAllDoors(query) {
  return request({
    url: baseClientDoorsUrl + "findAll",
    method: 'get',
    params: query
  })
}


