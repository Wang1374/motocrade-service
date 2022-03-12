import request from '@/utils/request'
const baseCompanyUrl = '/user/v1/company/'

// 查询企业信息
export function getCompany(id) {
    return request({
        url: baseCompanyUrl + 'getCompanyById/' + id,
        method: 'get'
    })
}

// 修改企业信息
export function updateCompany(data) {
    return request({
        url: baseCompanyUrl,
        method: 'put',
        data: data
    })
}

//查询所有企业信息
export function getMotorcade(){
    return request({
        url:baseCompanyUrl +"getMotorcade",
        method: 'get'
    })
}
