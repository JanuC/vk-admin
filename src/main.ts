import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'tailwindcss/tailwind.css'
import './styles/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
// pinia 持久化
import piniaPluginPersist from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersist)

const app = createApp(App)
app.use(router).use(ElementPlus).use(store).mount('#app')
