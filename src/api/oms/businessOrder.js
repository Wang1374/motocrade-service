import request from '@/utils/request'
const baseBusinessOrderUrl = '/order/v1/businessOrder/'

// 查询订单列表
export function listBusinessOrder(query) {
  return request({
    url: baseBusinessOrderUrl + 'businessOrderList',
    method: 'get',
    params: query
  })
}

// 新增订单
export function addBusinessOrder(data) {
  return request({
    url: baseBusinessOrderUrl,
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateBusinessOrder(data) {
  return request({
    url: baseBusinessOrderUrl,
    method: 'put',
    data: data
  })
}

// 根据id 修改订单状态
export function updateState(query) {
  return request({
    url: baseBusinessOrderUrl + "updateState",
    method: 'post',
    params: query
  })
}

// 删除订单
export function delBusinessOrder(data) {
  return request({
    url: baseBusinessOrderUrl,
    method: 'delete',
    data: data
  })
}

//导出数据
export function exportData(obj) {
  return request({
    url: baseBusinessOrderUrl + 'export',
    method: 'post',
    responseType: 'arraybuffer',
    headers: { 'filename': 'utf-8' },
    data: obj
  })
}

// 通过下单编号 查询 订单信息
export function getBusinessOrder(placeOrderNumber) {
  return request({
    url: baseBusinessOrderUrl + 'getBusinessOrder/' + placeOrderNumber,
    method: 'get'
  })
}

// 查询锦线平台订单列表
export function listPlatformOrders(query) {
  return request({
    url: baseBusinessOrderUrl + 'platformOrderList',
    method: 'get',
    params: query
  })
}

//标记为已读订单
export function alreadyReaderOrder(query) {
  return request({
    url: baseBusinessOrderUrl + 'alreadyReaderOrder',
    method: 'post',
    params: query
  })
}

//过滤已读未读订单
export function getIsReadOrder(query) {
  return request({
    url: baseBusinessOrderUrl + 'getIsReadOrder',
    method: 'post',
    params: query
  })
}

//根据订单编号查找数据
export function getDataByOrderNumber(orderNumber) {
  return request({
    url: baseBusinessOrderUrl + 'getDataByOrderNumber/' + orderNumber,
    method: 'get',
  })
}


//根据订单id和用户id查询redis中有没有
export function messageRedis(query) {
  return request({
    url: baseBusinessOrderUrl + 'messageRedis',
    method: 'get',
    params:query
  })
}


// updateStatusChat
// 根据userId和orderId  更新redis中用户操作订单信息
export function updateStatusChat(query) {
  return request({
    url: baseBusinessOrderUrl + 'updateStatusChat',
    method: 'get',
    params:query
  })
}