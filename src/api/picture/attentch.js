import request from '@/utils/request'
const baseUploadUrl = '/user/v1/attachment/upload'


// 上传图片
export function uploadPicture(data) {
  return request({
    url: baseUploadUrl,
    method: 'post',
    data:data,
  })
}