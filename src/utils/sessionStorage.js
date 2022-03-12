import { validatenull } from '@/utils/validate'
/**
 * 存储sessionStorage
 */
export const setSessionStorage = (params) => {
  const {
    name,
    content,
    type
  } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  // 直接放到sessionStorage
  window.sessionStorage.setItem(name, JSON.stringify(obj))
}
/**
 * sessionStorage
 */
export const getSessionStorage = (params) => {
  const {
    name
  } = params
  let obj = {}
  let content
  // 通过name（传入的zhi）在sessionStorage中查询
  obj = window.sessionStorage.getItem(name)
  if (validatenull(obj)) return
  obj = JSON.parse(obj)
  // 若根据dataType的类型，将obj的content赋值给变量content，最后返回变量content
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除sessionStorage
 */
export const removeSessionStorage = params => {
  const {
    name
  } = params
  window.sessionStorage.removeItem(name)
}
