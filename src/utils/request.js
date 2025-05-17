// 自定义fetch服务
import { useUserStore } from '@/stores/user'

// 基础URL
const BASE_URL = '/api';

// 创建请求服务
const service = {
  // GET请求
  async get(url, options = {}) {
    return await request(url, { 
      method: 'GET',
      ...options
    });
  },
  
  // POST请求
  async post(url, data, options = {}) {
    return await request(url, { 
      method: 'POST',
      data,
      ...options
    });
  },
  
  // PUT请求
  async put(url, data, options = {}) {
    return await request(url, { 
      method: 'PUT', 
      data,
      ...options
    });
  },
  
  // DELETE请求
  async delete(url, options = {}) {
    return await request(url, { 
      method: 'DELETE',
      ...options
    });
  },
  
  // PATCH请求
  async patch(url, data, options = {}) {
    return await request(url, { 
      method: 'PATCH', 
      data,
      ...options
    });
  }
};

// 请求处理函数
async function request(url, { method = 'GET', data = null, params = null, headers = {}, ...rest }) {
  try {
    // 获取token
    const userStore = useUserStore();
    if (userStore.token) {
      headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    
    // 设置Content-Type
    if (!headers['Content-Type'] && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      headers['Content-Type'] = 'application/json';
    }
    
    // 处理URL参数
    let fullUrl = `${BASE_URL}${url}`;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    // 准备fetch选项
    const fetchOptions = {
      method,
      headers,
      ...rest
    };
    
    // 添加请求体
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    // 发送请求
    const response = await fetch(fullUrl, fetchOptions);
    
    // 处理401错误
    if (response.status === 401) {
      userStore.logout();
      window.location.href = '/login';
      throw new Error('未授权，请重新登录');
    }
    
    // 解析响应
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // 检查响应状态
    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: responseData,
          statusText: response.statusText
        },
        message: `请求失败: ${response.status} ${response.statusText}`
      };
    }
    
    // 返回与axios类似的响应格式
    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  } catch (error) {
    if (error.response) {
      console.error('请求错误:', error.response.status);
    } else {
      console.error('请求错误:', error.message || '未知错误');
    }
    
    throw error;
  }
}

export default service; 