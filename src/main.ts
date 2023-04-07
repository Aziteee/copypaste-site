import { createApp, watch } from 'vue'
import App from '@/App.vue'
import router from '@/routes'
import { createPinia } from 'pinia'

import '@style/main.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'

// 自动切换深色模式
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.getElementsByTagName('html')[0].className = 'dark'
}

const pinia = createPinia()

// 数据持久化
if (localStorage.getItem('pinia')) {
  pinia.state.value = JSON.parse(<string>localStorage.getItem('pinia'))
}
watch(pinia.state, (state) => {
  localStorage.setItem('pinia', JSON.stringify(state))
}, { deep: true })

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
