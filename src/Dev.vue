<template>
	<div class="wrapper">
		<Picker v-model="value" class="picker" />
	</div>
</template>

<script>
import Picker from "./TwoChannelPicker.vue";

export default {
	components: {
		Picker,
	},
	data() {
		return {
			value: [1, 0],
		};
	},
	watch: {
		value(to) {
			sessionStorage.setItem("value", JSON.stringify(to));
		},
	},
	created() {
		const storageValue = sessionStorage.getItem("value");
		console.log(storageValue);
		if (storageValue) {
			this.value = JSON.parse(storageValue);
		}
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}
.picker {
	width: 300px;
	height: 300px;
}
</style>
