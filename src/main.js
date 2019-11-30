import Vue from "vue";

Vue.config.silent = false;
Vue.config.performance = true;
Vue.config.productionTip = false;

import Dev from "./Dev.vue";

new Vue({
	render: (h) => h(Dev),
}).$mount("#app");
