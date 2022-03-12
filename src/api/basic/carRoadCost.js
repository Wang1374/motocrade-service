import request from '@/utils/request'
const baseCarRoadCostUrl = '/order/v1/roadCost/'


//新增车辆过路费用记录
export function addCarRoadCost(data) {
    return request({
        url: baseCarRoadCostUrl,
        method: 'post',
        data: data
    })
}
//查询车辆过路费用记录
export function getCarRoadCost(query){
    return request({
        url:baseCarRoadCostUrl,
        method:'get',
        params:query
    })
}

//根据id修改车辆过路费用记录
export function editCarRoadCost(data) {
    return request({
        url: baseCarRoadCostUrl,
        method: 'put',
        data: data
    })
}

//删除车辆过路费用记录
export function deleteCarRoadCost(id) {
    return request({
        url: baseCarRoadCostUrl + id,
        method: 'delete'
    })
}