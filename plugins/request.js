import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

export default ({ store }) => {
  const user = store.state.user

  request.interceptors.request.use(
    config => {
      // 已登录用户请求数据携带 Token
      if (user?.token) {
        config.headers.Authorization = `Token ${user.token}`
      }
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )
}
