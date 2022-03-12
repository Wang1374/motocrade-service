import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import { setSessionStorage, getSessionStorage } from '@/utils/sessionStorage'
import Layout from '@/layout/index'

const permission = {
  state: {
    routes: getSessionStorage({
      name: 'routes'
    }) || []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.routes_init = routes
      setSessionStorage({
        name: 'routes_init',
        content: state.routes_init
      })
      state.routes = constantRoutes.concat(routes)
      setSessionStorage({
        name: 'routes',
        content: state.routes
      })
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        if (getSessionStorage({ name: 'routes' }) === undefined) {
          let obj = getSessionStorage({ name: 'userInfo' })
          getRouters(obj.employeeId).then(res => {
            commit('SET_ROUTES', res.data)
            const accessedRoutes = filterAsyncRouter(res.data)
            accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
            resolve(accessedRoutes)
          })
        } else {
          const accessedRoutes = filterAsyncRouter(getSessionStorage({ name: 'routes_init' }))
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          resolve(accessedRoutes)
        }
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
