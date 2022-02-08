import { createApp } from "vue";
import DevUI from "./DevUI.vue";

const app = createApp(DevUI);
app.config.performance = true;

app.mount("#app");
