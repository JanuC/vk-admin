import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "tailwindcss/tailwind.css"
import "./styles/style.css"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

const app = createApp(App)
app.use(router).use(ElementPlus).mount("#app")
