import request from '@/utils/request'

const baseMenuUrl = '/user/v1/menu/'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: baseMenuUrl + 'menus',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(obj) {
  return request({
    url: baseMenuUrl,
    method: 'post',
    data: obj
  })
}

// 修改菜单
export function updateMenu(obj) {
  return request({
    url: baseMenuUrl,
    method: 'put',
    data: obj
  })
}

// 删除菜单
export function delMenu(id) {
  return request({
    url: baseMenuUrl + id,
    method: 'delete'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: baseMenuUrl + 'treeselect',
    method: 'get'
  })
}

// 根据角色id查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: baseMenuUrl + 'roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}
