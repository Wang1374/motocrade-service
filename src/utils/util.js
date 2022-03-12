import CryptoJS from 'crypto-js'
import store from "@/store";

/**
 * 加密处理
 */
export const encryption = (params) => {
    var {
        data,
        type,
        param,
        key
    } = params
    // 序列化对象 data form 表单传过来的
    const result = JSON.parse(JSON.stringify(data))
    if (type === 'Base64') {
        param.forEach(ele => {
            result[ele] = btoa(result[ele])
        })
    } else {
        param.forEach(ele => {
            var data = result[ele]
            key = CryptoJS.enc.Latin1.parse(key)
            var iv = key
            var encrypted = CryptoJS.AES.encrypt(
                data,
                key,
                {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.ZeroPadding
                })
            result[ele] = encrypted.toString()
        })
    }
    return result
}

/**
 * 导出Excel
 */
export const exportExcel = function (response) {
    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    // 获取文件名
    const disposition = response.headers['content-disposition']
    if (disposition !== undefined) {
        link.download = decodeURI(disposition.substring(disposition.indexOf('=') + 2, disposition.length - 1))
        link.click()
        //下载完成进行释放
        window.URL.revokeObjectURL(link.href);
    }
}

/**
* 生成随机len位数字
*/
export const randomLenNum = (len, date) => {
    let random = ''
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
    if (date) random = Date.now() + random
    return random
}

/**
* 获取企业标识
*/
export function getCorporateIdentify() {
    let userInfo = store.getters.userInfo
    let corporateIdentify = userInfo.corporateIdentify
    let employeeId = userInfo.employeeId
    if (corporateIdentify === "-1" && employeeId === "-1") {
        return ""
    } else if (corporateIdentify !== "-1" && (corporateIdentify !== "" && corporateIdentify !== null)) {
        return corporateIdentify
    } else if (corporateIdentify === "" || corporateIdentify === null) {
        return employeeId
    }
}

/**
 * 获取当前时间
 * 格式YYYY-MM-DD
*/
export const getNowFormatDate = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year.toString() + month.toString() + strDate.toString();
    return currentdate;
}

// 封装一个判断图片文件后缀名的方法
export const isImage = (fileName) => {
    if (typeof fileName !== 'string') return;
    let name = fileName.toLowerCase();
    return name.endsWith('.png') || name.endsWith('.jpeg') || name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.bmp');
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export const isNotEmpty = (obj) => {
    let flag = true
    if (obj === '' || obj == null || obj === undefined || obj === 'undefined') {
        flag = false
    }
    return flag
}

/**
 * 判断响应是否成功
 * @param obj
 * @returns {boolean}
 */
export const isSuccess = (response) => {
    let success = true
    if (!isNotEmpty(response) || (response.code !== undefined && response.code !== 200)) {
        success = false
    }
    return success
}

