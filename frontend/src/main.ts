import { createApp } from 'vue'
import { Quasar, Dialog, Notify, Loading } from 'quasar'
import router from './router'
import { createPinia } from 'pinia'
import { permission, role } from '@/directives/permission';


// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import custom styles
import './css/app.scss'

// Import App component
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Loading
  },
  config: {
    notify: {
      position: 'top-right',
      timeout: 3000
    }
  }
})

app.use(pinia)
app.use(router)
app.directive('permission', permission);
app.directive('role', role);

app.mount('#app')