import { createApp, watch } from 'vue'
import App from '@/App.vue'
import router from '@/routes'
import { createPinia } from 'pinia'

import '@style/main.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/notification.scss'

import NProgress from 'nprogress';
import "nprogress/nprogress.css";

NProgress.configure({
  easing: 'ease',  // 动画的缓动函数（easing function）。这里设为 ease，表默认的缓动函数。   
  speed: 500,  // 递增进度条的速度;单位是毫秒    
  showSpinner: false, // 是否显示加载ico;是否在显示加载图标   
  trickleSpeed: 200, // 自动递增间隔;这里表示每间隔 200 毫秒自动递增一次进度   
  minimum: 0.3 // 初始化时的最小百分比
})

router.beforeEach((to, from , next) => {
  NProgress.start()
  next()
});

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

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
