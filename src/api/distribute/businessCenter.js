import request from '@/utils/request'
const baseBusinessCenterUrl = '/distribute/v1/businessCenter/'

// 查询下单/接单列表
export function getBusinessCenter(query) {
  return request({
    url: baseBusinessCenterUrl + 'businessCenterList',
    method: 'get',
    params: query
  })
}

//新增下单
export function addMakingCenter(data) {
  return request({
    url: baseBusinessCenterUrl + 'addMaking',
    method: 'post',
    data: data
  })
}

//修改下单数据
export function editMakingCenter(data){
  return request({
    url: baseBusinessCenterUrl+'editMaking',
    method:'post',
    data: data
  })
}

// 取消
export function cancelOrder(query) {
  return request({
    url: baseBusinessCenterUrl + "cancelOrder",
    method: 'post',
    params: query
  })
}

//派单列表取消
export function cancelDisparcherOrder(query){
  return request({
    url:baseBusinessCenterUrl+"cancelDisparcherOrder",
    method:'post',
    params:query
  })
}

// 接单
export function orderReceiving(data) {
  return request({
    url: baseBusinessCenterUrl + 'orderReceiving',
    method: 'post',
    data: data
  })
}

// 根据下单编号 修改派单状态
export function dispatchOrder(query) {
  return request({
    url: baseBusinessCenterUrl + "dispatchOrder",
    method: 'post',
    params: query
  })
}

// 查询派单列表
export function getDispatchList(query) {
  return request({
    url: baseBusinessCenterUrl + 'dispatchList',
    method: 'get',
    params: query
  })
}

