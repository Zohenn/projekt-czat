import { createApp } from 'vue'
import './style.scss';
import './firebase';
import App from './App.vue'
import router from './router'
import store from './store'
import vueDebounce from 'vue-debounce';

createApp(App).use(store).use(router).use(vueDebounce).mount('#app')
