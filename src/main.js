/* eslint-disable */

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VuetifyCalendar from './VuetifyCalendar.vue'
import DefaultCalendar from './sample/DefaultCalendar.vue'
Vue.config.productionTip = false

Vue.use(Vuetify);
Vue.component('vuetify-calendar', VuetifyCalendar);
Vue.component('default-calendar', DefaultCalendar);

new Vue({
  render (h) {
    return h('v-app', [
      h('div', { class: 'ma-3' }, [ h('default-calendar') ]),
    ])
  }
}).$mount('#app')
