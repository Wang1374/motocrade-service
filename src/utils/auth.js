import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils/localStorage'

export function getToken() {
  return getLocalStorage({ name: 'access_token' })
}

export function setToken(token) {
  return setLocalStorage({ name: 'access_token' }, token)
}

export function removeToken() {
  return removeLocalStorage({ name: 'access_token' })
}

export function getRefreshToken() {
  return getLocalStorage({ name: 'refresh_token' })
}

export function setRefreshToken(token) {
  return setLocalStorage({ name: 'refresh_token' }, token)
}

export function removeRefreshToken() {
  return removeLocalStorage({ name: 'refresh_token' })
}
