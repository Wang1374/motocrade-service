import request from '@/utils/request'
import { getRefreshToken } from '@/utils/auth'

const baseAuthenticationUrl = '/auth/v1/authentication/'
const basicAuthorization = 'Basic ' + btoa('web_app:spring-microservice-exam-secret')

// 效验图形验证码
export function checkGraphCod(data) {
  return request({
    url: '/user/v1/code/checkGraphCode',
    method: 'post',
    params: data
  })
}

// 获取手机验证码
export function getSmsCode(phone) {
  return request({
    url: '/user/v1/user/getSmsCode',
    method: 'get',
    params: { phone }
  })
}


// 效验手机验证码
export function checkSmsCode(data) {
  return request({
    url: '/user/v1/user/checkSmsCode',
    method: 'post',
    params: data
  })
}

// 注册
export function register(data) {
  return request({
    url: '/user/v1/user/register',
    method: 'post',
    data: data
  })
}

/**
 * 登录
 * @param identifier 账号
 * @param credential 密码
 */
export function login(identifier, credential) {
  const grantType = 'password'
  const scope = 'read'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'Authorization': basicAuthorization
    },
    method: 'post',
    params: { username: identifier, credential, grant_type: grantType, scope }
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/user/v1/user/info',
    method: 'get'
  })
}

// 退出方法
export function logout(accesstoken, refreshToken) {
  return request({
    url: baseAuthenticationUrl + 'removeToken',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

/**
 * 刷新token
 */
export function refreshToken () {
  //  grant_type为refresh_token
  const grantType = 'refresh_token'
  const scope = 'read'
  const refreshToken = getRefreshToken()
  return request({
    url: '/auth/oauth/token',
    headers: {
      'Authorization': basicAuthorization
    },
    method: 'post',
    params: { grant_type: grantType, scope, refresh_token: refreshToken }
  })
}
