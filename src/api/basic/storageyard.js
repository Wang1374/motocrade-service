import request from '@/utils/request'
const baseStorageYardUrl = '/order/v1/storageYard/'

// 查询堆场列表
export function listStorageYard(query) {
  return request({
    url: baseStorageYardUrl + 'storageYardList',
    method: 'get',
    params: query
  })
}

// 新增堆场
export function addStorageYard(data) {
  return request({
    url: baseStorageYardUrl,
    method: 'post',
    data: data
  })
}

// 修改堆场
export function updateStorageYard(data) {
  return request({
    url: baseStorageYardUrl,
    method: 'put',
    data: data
  })
}

// 删除堆场
export function delStorageYard(id) {
  return request({
    url: baseStorageYardUrl + id,
    method: 'delete'
  })
}