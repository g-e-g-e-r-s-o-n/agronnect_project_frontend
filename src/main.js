// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
// import Vue from 'vue'
import VueCookies from 'vue-cookies'


createApp(App)
    .use(router)
    .use(VueCookies, { expires: '1h'})
    .mount("#app");