import Vue from "vue";

Vue.config.silent = false;
Vue.config.performance = true;
Vue.config.productionTip = false;

import Demo from "./TwoChannelPicker.vue";
new Vue({
	render: (h) => h(Demo),
}).$mount("#app");
