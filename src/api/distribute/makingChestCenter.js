import request from '@/utils/request'
const baseMakingChestCenterUrl = '/distribute/v1/makingChestCenter/'

// 查询下单列表
export function getMakingChestCenterList(placeOrderId) {
    return request({
        url: baseMakingChestCenterUrl + 'getMakingChestCenterList/' + placeOrderId,
        method: 'get'
    })
}

