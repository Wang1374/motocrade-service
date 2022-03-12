import { login, logout, getInfo } from '@/api/login'
import { setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { setLocalStorage, getLocalStorage } from '@/utils/localStorage'
import { setSessionStorage, getSessionStorage, removeSessionStorage } from '@/utils/sessionStorage'
import { encryption } from '@/utils/util'

const user = {
  state: {
    name: getSessionStorage({
      name: 'name'
    }) || '',
    avatar: getSessionStorage({
      avatar: 'avatar'
    }) || '',
    userInfo: getSessionStorage({
      name: 'userInfo'
    }) || {},
    permissions: getSessionStorage({
      name: 'permissions'
    }) || [],
    roles: [],
    access_token: getLocalStorage({
      name: 'access_token'
    }) || '',
    refresh_token: getLocalStorage({
      name: 'refresh_token'
    }) || ''
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, accessToken) => {
      state.access_token = accessToken
      setLocalStorage({
        name: 'access_token',
        content: state.access_token
      })
    },
    SET_NAME: (state, name) => {
      state.name = name
      setSessionStorage({
        name: 'name',
        content: state.name
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setSessionStorage({
        name: 'userInfo',
        content: state.userInfo
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setLocalStorage({
        name: 'refresh_token',
        content: state.refresh_token
      })
    },
    // 存头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      setSessionStorage({
        name: 'avatar',
        content: state.avatar
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      // setSessionStorage({
      //   name: 'roles',
      //   content: state.roles
      // })
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
      setSessionStorage({
        name: 'permissions',
        content: state.permissions
      })
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        // 密码加密
        const user = encryption({
          data: { identifier: username, credential: password },
          key: '1234567887654321',
          param: ['credential']
        })
        login(user.identifier, user.credential).then(res => {
          // 若登录成功存入token,并修改store状态
          setToken(res.data.access_token)
          setRefreshToken(res.data.refresh_token)
          commit('SET_ACCESS_TOKEN', res.data.access_token)
          commit('SET_REFRESH_TOKEN', res.data.refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data.data
          const avatar = data.avatarUrl === "" ? require("@/assets/image/profile.jpg") : data.avatarUrl;
          // const avatar = require("@/assets/image/profile.jpg");
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_USER_INFO', data)
            commit('SET_ROLES', data.roles)
            commit('SET_PERMISSIONS', data.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.access_token, state.refresh_token).then(() => {
          // 清除权限
          commit('SET_PERMISSIONS', [])
          // 清除用户信息
          commit('SET_USER_INFO', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          removeSessionStorage({ name: 'routes' })
          // 清除系统配置信息
          // commit('SET_SYS_CONFIG', {})
          removeToken()
          removeRefreshToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 注销session
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        // 清除权限
        commit('SET_PERMISSIONS', [])
        // 清除用户信息
        commit('SET_USER_INFO', {})
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])
        removeSessionStorage({ name: 'routes' })
        // 清除系统配置信息
        // commit('SET_SYS_CONFIG', {})
        removeToken()
        removeRefreshToken()
        resolve()
      })
    }
  }
}

export default user
