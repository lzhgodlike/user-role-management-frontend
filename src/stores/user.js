import { defineStore } from 'pinia'
import service from '@/utils/request'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // actions
  const login = async (credentials) => {
    try {
      const response = await service.post('/auth/login', credentials);
      const data = response.data
      
      setToken(data.token)
      setUser({
        id: data.id,
        username: data.username,
        role: data.role
      })
      
      return data
    } catch (error) {
      console.error('登录失败:', error.message);
      clearAuth()
      throw error
    }
  }

  const logout = () => {
    clearAuth()
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    login,
    logout,
    setToken,
    setUser
  }
}, {
  persist: true
}) 