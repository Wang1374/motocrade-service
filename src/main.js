import Vue from 'vue'

import Cookies from 'js-cookie'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'


import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './assets/alifont/iconfont.css'
import './permission' // permission control
import { getConfigKey } from "@/api/system/config";
import { parseTime, formatDate, resetForm, addDateRange, cardid, selectDictLabel, download, handleTree, handleUserTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import VDistpicker from 'v-distpicker'
import VueCropper from 'vue-cropper'



import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

Vue.use(VXETable)
Vue.use(VXEUtils, XEUtils)

// 给 vue 实例挂载全局窗口对象，属性名称随意定义，例如：$XModal
Vue.prototype.$modal = VXETable.modal

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
VXETable.use(VXETablePluginElement)

import Print from "vue-print-nb"
Vue.use(Print)

import htmlToPdf from '@/components/utils/htmlToPdf'
Vue.use(htmlToPdf)

import GoEasy from 'goeasy';

// 全局方法挂载
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.formatDate = formatDate
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.handleUserTree = handleUserTree
Vue.prototype.cardid = cardid

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

//初始化全局GoEasy对象
Vue.prototype.$goEasy = new GoEasy({
  host: 'hangzhou.goeasy.io',// 应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
  appkey: "BC-577d22cac6404d699b1cde65380e0f31",// 替换为您的应用appkey
  onConnected: function () {
    console.log('连接成功！')
  },
  onDisconnected: function () {
    console.log('连接断开！')
  },
  onConnectFailed: function (error) {
    console.log('连接失败或错误！')
  }
});

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('v-distpicker', VDistpicker)

Vue.use(permission)
Vue.use(VueCropper)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
