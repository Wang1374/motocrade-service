import request from '@/utils/request'
const baseAttendanceUrl = '/order/v1/attendance/'

// 新增考勤记录
export function addAttendance(data) {
  return request({
    url: baseAttendanceUrl,
    method: 'post',
    data: data
  })
}

// 根据司机id获取考勤记录
export function getDataByDriverId(query){
  return request({
    url: baseAttendanceUrl+'getDataByDriverId',
    method: 'get',
    params:query
  })
}
