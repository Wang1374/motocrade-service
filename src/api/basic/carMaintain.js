import request from '@/utils/request'
const baseMainTainUrl = '/order/v1/maintain/'

//新增车辆维修记录
export function saveMaintain(data) {
    return request({
        url: baseMainTainUrl,
        method: 'post',
        data: data
    })
}
//根据id修改车辆保养维修记录
export function editMainTain(data) {
    return request({
        url: baseMainTainUrl,
        method: 'put',
        data: data
    })
}
//查询保养维修记录
export function getMaintain(query) {
    return request({
        url: baseMainTainUrl + 'getMaintain',
        method: 'get',
        params: query
    })
}
//根据id删除保养维修记录
export function deleteCarMain(id) {
    return request({
        url: baseMainTainUrl + id,
        method: 'delete'
    })
}

