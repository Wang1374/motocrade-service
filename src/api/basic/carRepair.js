import request from '@/utils/request'
const baseRepairUrl = '/order/v1/carRepair/'

//新增维修记录
export function addCarRepair(data) {
    return request({
        url: baseRepairUrl,
        method: 'post',
        data: data
    })
}

//分页查询车辆维修记录
export function getCarRepair(query) {
    return request({
        url: baseRepairUrl,
        method: 'get',
        params: query
    })
}

//修改车辆维修信息
export function editCarRepair(data) {
    return request({
        url: baseRepairUrl,
        method: 'put',
        data: data
    })
}

//删除车辆维修记录
export function deleteCarRepair(id){
    return request({
        url:baseRepairUrl+id,
        method:'delete'
    })
}

