import request from '@/utils/request'
const baseMakingChestUrl = '/order/v1/makingChest/'

// 获取做箱信息列表
export function getMakingChestList(query) {
    return request({
        url: baseMakingChestUrl + 'getMakingChestList',
        method: 'get',
        params: query
    })
}

// 批量更改做箱信息
export function cudMakingChest(data) {
    return request({
        url: baseMakingChestUrl,
        method: 'put',
        data: data
    })
}
//箱货照片修改与上传
export function updateMakingPictureById(data) {
    return request({
        url: baseMakingChestUrl + 'updatePicture',
        method: 'put',
        data: data
    })
}
// 修改已全/未全
export function updateMakingChest(data) {
    return request({
        url: baseMakingChestUrl + 'updateMakingChest',
        method: 'put',
        data: data
    })
}


//根据做箱id获取lcl
export function getLclList(mcId) {
    return request({
        url: baseMakingChestUrl + 'getLclList/' + mcId,
        method: 'get'
    })
}

//根据做箱id修改做箱状态
export function updateMakStatusById(query) {
    return request({
        url: baseMakingChestUrl + 'updateMakStatusById',
        method: 'post',
        params: query
    })
}


//根据做箱id获取做箱状态
export function findMakingChestById(id) {
    return request({
        url: baseMakingChestUrl + 'findMakingChestById/' + id,
        method: 'get',
    })
}


//根据做箱id获取做箱状态
export function updateUrlById(params) {
    return request({
        url: baseMakingChestUrl + 'updateUrlById',
        method: 'get',
        params:params
    })
}