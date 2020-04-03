import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// Temporário!
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkdhYnJpZWwgZGUgTWF0b3MiLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU4NTg2Njk0MiwiZXhwIjoxNTg2MTI2MTQyfQ.cMLNo00PGNwY8hcVTIbWrTz0nN9X1xchrwCUrsZR5bQ'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')