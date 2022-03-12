import request from '@/utils/request'
const baseClienteleUrl = '/order/v1/clientele/'

// 查询客户列表
export function listClientele(query) {
  return request({
    url: baseClienteleUrl + 'clienteleList',
    method: 'get',
    params: query
  })
}

// 查询供应商列表
export function listSupplier(query) {
  return request({
    url: baseClienteleUrl + 'supplierList',
    method: 'get',
    params: query
  })
}

// 查询往来单位列表
export function listBtype(query) {
  return request({
    url: baseClienteleUrl + 'btypeList',
    method: 'get',
    params: query
  })
}

// 新增客户
export function addClientele(data) {
  return request({
    url: baseClienteleUrl,
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateClientele(data) {
  return request({
    url: baseClienteleUrl,
    method: 'put',
    data: data
  })
}

// 删除客户
export function delClientele(id) {
  return request({
    url: baseClienteleUrl + id,
    method: 'delete'
  })
}

// 获取全部客户
export function allClientele(corporateIdentify) {
  return request({
    url: baseClienteleUrl + 'allClienteleList/' + corporateIdentify,
    method: 'get'
  })
}

// 获取客户与联系方式
export function getClienteleAndContact(corporateIdentify) {
  return request({
    url: baseClienteleUrl + 'getClienteleAndContact/' + corporateIdentify,
    method: 'get'
  })
}
