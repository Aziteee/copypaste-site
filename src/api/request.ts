import axios from 'axios'
import { ElMessage } from 'element-plus'

const requests = axios.create({
  baseURL: '/api',
  timeout: 50000,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
})

requests.interceptors.response.use(null, (error) => {
  if (error.response?.data?.error) {
    ElMessage.error(error.response.data.error)
  } else error.message ?? ElMessage.error(error.message)
  return Promise.reject(error)
})

export default requests
