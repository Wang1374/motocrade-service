import request from '@/utils/request'
const baseMessageUrl = '/user/v1/message/'

//根据公司id查询消息列表数据
export function getUserMessage(query) {
  return request({
    url: baseMessageUrl + 'getMessage',
    method: 'get',
    params: query
  })
}

//标记为已读
export function updateStatusByIds(query) {
  return request({
    url: baseMessageUrl + 'updateStatus/',
    method: 'put',
    params: query
  })
}

//标记为全部已读
export function updateAllRead(bId) {
  return request({
    url: baseMessageUrl + "updateAllRead/" + bId,
    method: 'put'
  })
}

//根据id删除消息
export function deleteMessageByIds(query) {
  return request({
    url: baseMessageUrl + 'deleteMessage/',
    method: 'put',
    params: query
  })
}

//查询消息未读数量
export function getMessageNotRead(belongCompaniesId) {
  return request({
    url: baseMessageUrl + 'getMessageNotRead/' + belongCompaniesId,
    method: 'get'
  })
}