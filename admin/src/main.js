import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./style/element_visiable.scss";
import admin from "@/config/admin.js";
import router from "@/router/index.js";
import store from "@/pinia/index.js";
import "@/router/permission.js";

const app = createApp(App);
app.config.productionTip = false;

app.use(ElementPlus);
app.use(admin);
app.use(router);
app.use(store);

app.mount("#app");
