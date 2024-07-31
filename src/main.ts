import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import 'tailwindcss/tailwind.css'
import './styles/style.scss'
import ElementPlus from 'element-plus'
import loadingDirective from './utils/directive/loading'

import { createPinia } from 'pinia'
// pinia 持久化
import piniaPluginPersist from 'pinia-plugin-persistedstate'
import permissionDirective from './utils/directive/permission'

const store = createPinia()
store.use(piniaPluginPersist)

const app = createApp(App)
app.directive('cLoading', loadingDirective)
app.directive('permission', permissionDirective)
app.use(router).use(ElementPlus).use(store).mount('#app')
