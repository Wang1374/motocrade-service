import request from '@/utils/request'
const baseTyreUrl = '/order/v1/carTyre/'

//新增维修记录
export function addCarTyre(data) {
    return request({
        url: baseTyreUrl,
        method: 'post',
        data: data
    })
}

//分页查询车辆维修记录
export function getList(query) {
    return request({
        url: baseTyreUrl,
        method: 'get',
        params: query
    })
}

//修改轮胎费用信息
export function updateCarTyre(data) {
    return request({
        url: baseTyreUrl,
        method: 'put',
        data: data
    })
}

//删除车辆轮胎费用记录
export function deleteCarTyre(id){
    return request({
        url:baseTyreUrl+id,
        method:'delete'
    })
}

