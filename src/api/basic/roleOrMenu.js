import request from '@/utils/request'

const baseAuthorityUrl = '/user/v1/authority/'

// 查询所有角色
export function allRoles(query) {
  return request({
    url: baseAuthorityUrl + 'allRoles',
    method: 'get',
    params: query
  })
} 

// 查询菜单下拉树结构
export function treeselect(roleCode) {
  return request({
    url: baseAuthorityUrl + 'treeselect/' + roleCode,
    method: 'get'
  })
}

// 新增员工角色
export function addRole(data) {
  return request({
    url: baseAuthorityUrl,
    method: 'post',
    data: data
  })
}

// 根据企业标识id，查出所有员工角色
export function getStaffRole(corporateIdentify) {
  return request({
    url: baseAuthorityUrl + 'getStaffRole/' + corporateIdentify,
    method: 'get'
  })
}


// 根据角色id查询菜单下拉树结构
export function roleMenuTreeselect(query) {
  return request({
    url: baseAuthorityUrl + 'roleMenuTreeselect',
    method: 'get',
    params: query
  })
}

// 修改员工角色
export function updateRole(data) {
  return request({
    url: baseAuthorityUrl,
    method: 'put',
    data: data
  })
}

