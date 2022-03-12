/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 日期格式化yyyy-MM-dd
// export function formatDate(date) {
// 	if (date !== null) {
// 		var date = new Date(date);
// 		var y = 1900 + date.getYear();
// 		var m = "0" + (date.getMonth() + 1);
// 		var d = "0" + date.getDate();
// 		return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
// 	}
// }

// 日期格式化
export function formatDate(date, fmt) {
	if (date !== null) {
		var date = new Date(date);
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		let o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
		};
		for (let k in o) {
			if (new RegExp(`(${k})`).test(fmt)) {
				let str = o[k] + '';
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
			}
		}
		return fmt;
	}
};

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
};

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].clearValidate();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange) {
	var search = params;
	search.beginTime = "";
	search.endTime = "";
	if (null != dateRange && '' != dateRange) {
		search.beginTime = this.dateRange[0];
		search.endTime = this.dateRange[1];
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).map((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return false;
		}
	})
	return actions.join('');
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || '-1'
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
}

/**
* 构造树型结构数据
* @param {*} data 数据源
* @param {*} corporateIdentify 企业标识ID
* @param {*} employeeId 员工标识ID
*/
export function handleUserTree(data, corporateIdentify, employeeId) {
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			if (father[corporateIdentify] !== "-1") {
				return father[corporateIdentify] === child[employeeId]
			}
		});
		branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层
		return father[corporateIdentify] !== undefined;
	});
	return treeData != '' ? treeData : data;
}


/**
 * 判断身份证号码
 */
export function cardid(code) {
	const list = []
	let result = true
	let msg = ''
	var city = {
		11: '北京',
		12: '天津',
		13: '河北',
		14: '山西',
		15: '内蒙古',
		21: '辽宁',
		22: '吉林',
		23: '黑龙江 ',
		31: '上海',
		32: '江苏',
		33: '浙江',
		34: '安徽',
		35: '福建',
		36: '江西',
		37: '山东',
		41: '河南',
		42: '湖北 ',
		43: '湖南',
		44: '广东',
		45: '广西',
		46: '海南',
		50: '重庆',
		51: '四川',
		52: '贵州',
		53: '云南',
		54: '西藏 ',
		61: '陕西',
		62: '甘肃',
		63: '青海',
		64: '宁夏',
		65: '新疆',
		71: '台湾',
		81: '香港',
		82: '澳门',
		91: '国外 '
	}
	if (!validatenull(code)) {
		if (code.length === 18) {
			if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
				msg = '证件号码格式错误'
			} else if (!city[code.substr(0, 2)]) {
				msg = '地址编码错误'
			} else {
				code = code.split('')
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x']
				var sum = 0
				var ai = 0
				var wi = 0
				for (var i = 0; i < 17; i++) {
					ai = code[i]
					wi = factor[i]
					sum += ai * wi
				}
				//         if (parity[sum % 11] !== code[18]) {
				//           msg = '证件号码校验位错误'
				//         } else {
				//           result = false
				//         }
			}
		} else {
			msg = '证件号码长度不为18位'
		}
	} else {
		msg = '证件号码不能为空'
	}
	list.push(result)
	list.push(msg)
	return list
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
	if (val instanceof Array) {
		if (val.length === 0) {
			return true
		}
	} else if (val instanceof Object) {
		if (JSON.stringify(val) === '{}') {
			return true
		}
	} else {
		if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') {
			return true
		}
		return false
	}
	return false
}
export function Mul(arg1, arg2){
		var m=0,s1=arg1.toString(),s2=arg2.toString();
		try{
			m+=s1.split(".")[1].length;
		}catch(e){}
		try{
			m+=s2.split(".")[1].length;
		}catch(e){}
		return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}
//小数的减法操作
export function Subtr(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	//last modify by deeka
	//动态控制精度长度
	n = r1 >= r2 ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//小数加法运算
export function addNum(num1, num2) {
	var sq1, sq2, m;
	try {
		sq1 = num1.toString().split(".")[1].length;
	} catch (e) {
		sq1 = 0;
	}
	try {
		sq2 = num2.toString().split(".")[1].length;
	} catch (e) {
		sq2 = 0;
	}
	m = Math.pow(10, Math.max(sq1, sq2));
	return (num1 * m + num2 * m) / m;
}