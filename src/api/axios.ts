import axios from 'axios'

// ✅ 判斷是否為 GitHub Pages 環境
const isProd = location.pathname.startsWith('/micro-root')

const instance = axios.create({
  baseURL: isProd ? 'https://api.hex-studio.net/api/v1' : '/api/v1',
  timeout: 10000,
  withCredentials: true, // 若有跨域 cookie 可保留
})

// ✅ 請求攔截器（自動加上 token）
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ✅ 回應攔截器（401 統一處理）
instance.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // localStorage.removeItem('username')
      const base = isProd ? '/micro-root' : ''
      window.location.href = `${base}/auth/login`
    }
    return Promise.reject(error)
  },
)

export default instance
