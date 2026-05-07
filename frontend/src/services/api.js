import axios from 'axios'

/**
 * Single axios instance for the entire app.
 * withCredentials: true → browser sends httpOnly cookie automatically.
 * No token stored in JS — fully secure.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Redirect to login on 401 (expired or missing cookie)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
