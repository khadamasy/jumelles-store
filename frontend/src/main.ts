import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { purgeSensitiveBrowserStorage } from './stores/auth';
import './styles/variables.css';
import './style.css';

purgeSensitiveBrowserStorage();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

