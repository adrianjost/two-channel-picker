<template>
	<div class="wrapper">
		<h1> {{ formatedValue }} </h1>
		<div style="margin: 1em 0;">
			<button @click="visible = !visible">toggle visibility</button>
		</div>
		<Picker
			v-if="visible"
			v-model="value"
			:options="{ colorLeft: '#9df', colorRight: '#fd9' }"
			class="picker"
		/>
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
			visible: true,
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
		if (storageValue) {
			this.value = JSON.parse(storageValue);
		}
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
		"Helvetica Neue", Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
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
