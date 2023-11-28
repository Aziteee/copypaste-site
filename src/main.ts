import { createApp, watch } from 'vue'
import App from '@/App.vue'
import router from '@/routes'
import { createPinia } from 'pinia'
import { createLogto, LogtoConfig } from '@logto/vue'
import * as consts from './consts'

import '@style/main.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/notification.scss'
import 'element-plus/theme-chalk/src/input.scss'

import NProgress from 'nprogress'
import "nprogress/nprogress.css"

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

router.beforeEach((to, from , next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {  
 NProgress.done()
 scrollTo(0, 0)
})


// 自动切换深色模式
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // document.getElementsByTagName('html')[0].className = 'dark'
}

const pinia = createPinia()

// 数据持久化
if (localStorage.getItem('pinia')) {
  pinia.state.value = JSON.parse(<string>localStorage.getItem('pinia'))
}
watch(pinia.state, (state) => {
  localStorage.setItem('pinia', JSON.stringify(state))
}, { deep: true })

const config: LogtoConfig = {
  endpoint: consts.endpoint,
  appId: consts.appId,
  resources: [consts.resource]
}

const app = createApp(App)

app.use(createLogto, config);
app.use(pinia)
app.use(router)

app.mount('#app')
