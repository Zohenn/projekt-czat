import { createApp } from 'vue'
import './style.scss';
import './firebase';
import App from './App.vue'
import router from './router'
import store from './store'
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App).use(store).use(router);
// app.component('fa', FontAwesomeIcon);
app.mount('#app')
