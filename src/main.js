import Vue from "vue";
import "./styles.css";
import App from "./App.vue";
import { invoke } from '@tauri-apps/api/tauri';
document.addEventListener('DOMContentLoaded', () => {
  // This will wait for the window to load, but you could
  // run this function on whatever trigger you want
  invoke('close_splashscreen')
})
new Vue({
  render: (h) => h(App),
}).$mount('#app');