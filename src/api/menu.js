import request from '@/utils/request'

const baseMenuUrl = '/user/v1/menu/'

// 获取路由
export const getRouters = (employeeId) => {
  return request({
    url: baseMenuUrl + 'getRouters/' + employeeId,
    method: 'get'
  })
}
