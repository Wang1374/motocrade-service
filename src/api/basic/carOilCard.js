import request from '@/utils/request'
const baseOilCardUrl = '/order/v1/oilCard/'

//新增油卡记录
export function addOilxtCard(data) {
    return request({
        url: baseOilCardUrl,
        method: 'post',
        data: data
    })
}

//根据车辆id查询所有找油网油卡记录
export function getOilzyCardList(query) {
    return request({
        url: baseOilCardUrl+'getOilzyCardList',
        method: 'get',
        params:query
        
    })
}


//根据车辆id查询所有油卡记录
export function getOilxtCardList(query) {
    return request({
        url: baseOilCardUrl+'getOilxtCardList',
        method: 'get',
        params:query
        
    })
}

//根据车辆id编辑油卡记录
export function editOilCard(data) {
    return request({
        url: baseOilCardUrl,
        method: 'put',
        data: data
    })
}

//根据车辆维修记录id批量删除车辆油卡信息
export function deleteOilById(id) {
    return request({
        url: baseOilCardUrl + id,
        method: 'delete'
    })
}

// 下载油费记录模板
export function exportOil(type) {
    return request({
        url: baseOilCardUrl + 'downLoad',
        method: 'post',
        responseType: 'arraybuffer',
        headers: { 'Download-Type': type },
    })
}