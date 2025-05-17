import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 引入自定义主题样式
import './styles/theme.scss'

// 创建Pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建应用实例
const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app') 