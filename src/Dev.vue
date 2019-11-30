<template>
	<div class="wrapper">
		<h1> {{ formatedValue }} </h1>
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
	computed: {
		formatedValue() {
			const digits = 5;
			const h = Math.pow(10, digits);
			const format = (v) => parseFloat(Math.round(v * h) / h).toFixed(digits);
			return this.value.map(format);
		},
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
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
}
.picker {
	display: inline-block;
	width: 300px;
	height: 300px;
}
</style>
