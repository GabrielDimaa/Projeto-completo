import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// Temporário!
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkdhYnJpZWwgZGUgTWF0b3MiLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU4NTc2NDk3MywiZXhwIjoxNTg2MDI0MTczfQ.Obd3pUlj0W7t3N45fS62goeQkt3h8jdVwLMvS9m2J20'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')