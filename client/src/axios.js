
import axios from 'axios';

// Tạo axios instance
export const makeRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL+'/api',
  withCredentials: true, // Để gửi cookie với request
});


makeRequest.interceptors.response.use(
  
  (response) => {
    return response // nếu có response thì trả về response
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response && (error.response.status === 403 || error.response.status === 401) ) {// Nếu access_token hết hạn 
      try {
        const result = await makeRequest.post('auth/refresh-token', {
          refresh_token: localStorage.getItem('refresh_token') // Gọi API refresh_token
        })
        const access_token = result.data; // trả về access_token
        originalConfig.headers['Authorization'] = `Bearer ${access_token}` // đưa access_token vào header của request
        return makeRequest(originalConfig) //gửi tiếp request
      } catch (err) { //xảy ra lỗi 
        if (err.response && err.response.status === 400) { // nếu lỗi là khi refresh_token hết hạn 
          await makeRequest.post('auth/logout',{
            refresh_token: localStorage.getItem('refresh_token') // Gọi API logout để xóa refresh_token trong DB
          })
          localStorage.removeItem('user') 
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)






