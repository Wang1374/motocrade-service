import request from '@/utils/request'

const baseRoleUrl = '/user/v1/role/'

// 查询角色列表
export function listRole(query) {
  return request({
    url: baseRoleUrl + 'roleList',
    method: 'get',
    params: query
  })
}

// 查询所有角色
export function allRoles(query) {
  return request({
    url: baseRoleUrl + 'allRoles',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: baseRoleUrl + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: baseRoleUrl,
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: baseRoleUrl,
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: baseUserUrl + 'changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(id) {
  return request({
    url: baseRoleUrl + id,
    method: 'delete'
  })
}

// 批量删除角色
export function delAllRole(obj) {
  return request({
    url: baseRoleUrl + 'deleteAll',
    method: 'post',
    data: obj
  })
}
