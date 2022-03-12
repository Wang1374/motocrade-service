import request from '@/utils/request'
const baseUserUrl = '/user/v1/user/'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: baseUserUrl + 'userList',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: baseUserUrl,
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: baseUserUrl,
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: baseUserUrl + id,
    method: 'delete'
  })
}

// 批量删除用户
export function delAllUser(obj) {
  return request({
    url: baseUserUrl + 'deleteAll',
    method: 'post',
    data: obj
  })
}

// 导出用户
export function exportUser(obj) {
  return request({
    url: baseUserUrl + 'export',
    method: 'post',
    responseType: 'arraybuffer',
    headers: { 'filename': 'utf-8' },
    data: obj
  })
}

// 用户密码重置
export function resetUserPwd(obj) {
  return request({
    url: baseUserUrl + 'resetPassword',
    method: 'put',
    data: obj
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
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

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: baseUserUrl + 'info',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: baseUserUrl + 'updateInfo',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword, identifier) {
  const data = {
    oldPassword,
    newPassword,
    identifier
  }
  return request({
    url: baseUserUrl + 'updatePassword',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: baseUserUrl + 'updateAvatar',
    method: 'put',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

// 获取企业所有账户
export function getAllCorporateAccount(corporateIdentify) {
  return request({
    url: baseUserUrl + 'getAllCorporateAccount/' + corporateIdentify,
    method: 'get'
  })
}

//获取员工
export function getEmployee(corporateIdentify) {
  return request({
    url: baseUserUrl + 'getEmployee/' + corporateIdentify,
    method: 'get',
  })
}



