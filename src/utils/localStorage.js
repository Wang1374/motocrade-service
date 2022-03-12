import { validatenull } from '@/utils/validate'
/**
 * 存储localStorage
 */
export const setLocalStorage = (params) => {
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
  // 直接放到localStorage
  window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * localStorage  
 */
export const getLocalStorage = (params) => {
  const {
    name
  } = params
  let obj = {}
  let content
  // 通过name（传入的zhi）在sessionStorage中查询
  obj = window.localStorage.getItem(name)
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
 * 删除localStorage
 */
export const removeLocalStorage = params => {
  const {
    name
  } = params
  window.localStorage.removeItem(name)
}
