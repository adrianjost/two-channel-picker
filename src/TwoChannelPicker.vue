<template>
	<!-- TODO decouple visual color value from v-model value to fade between full 255 and 0 on only 2 channels -->
	<div>
		<GlobalEvents
			@mousemove="move"
			@touchmove="move"
			@mouseup="end"
			@touchend="end"
		/>
		<div
			ref="picker"
			:style="
				`background: linear-gradient(to right, ${colorLeft} 0%, ${colorRight} 100%);`
			"
			@touchstart="start"
			@mousedown="start"
			class="tone-picker"
		>
			<div
				ref="marker"
				:class="{ marker: true, active: dragActive }"
				:style="{
					background: currentColor,
					left: `${x * 100}%`,
					bottom: `${y * 100}%`,
				}"
			/>
		</div>
	</div>
</template>

<script>
import colorConversion from "@/colorConversion.js";
import GlobalEvents from "vue-global-events";

export default {
	components: {
		GlobalEvents,
	},
	mixins: [colorConversion],
	props: {
		value: {
			type: Array,
			default: () => [1, 0],
			validator: (v) => v[0] >= 0 && v[0] <= 1 && v[1] >= 0 && v[1] <= 1,
		},
		colorLeft: {
			type: String,
			default: "#fd9",
		},
		colorRight: {
			type: String,
			default: "#9df",
		},
		readOnly: {
			type: Boolean,
		},
	},
	data() {
		return {
			dragActive: false,
			x: 1,
			y: 1,
		};
	},
	animation: {
		animationFrame: undefined,
		changeTimeout: undefined,
		hasChangedLately: false,
	},
	computed: {
		currentColor() {
			return this.getColorForPosition({
				x: this.x,
				y: this.y,
			});
		},
	},
	watch: {
		currentColor(to) {
			this.$emit("input", [(1 - this.x) * this.y, this.x * this.y]);
		},
		value(values) {
			if (this.$options.hasChangedLately) {
				clearTimeout(this.$options.changeTimeout);
				this.$options.changeTimeout = setTimeout(() => {
					this.$options.hasChangedLately = false;
				}, 200);
				return;
			}
			this.$options.hasChangedLately = true;
			this.$options.changeTimeout = setTimeout(() => {
				this.$options.hasChangedLately = false;
			}, 200);
			const { x, y } = this.getPositionForChannels(values);
			this.x = x;
			this.y = y;
		},
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		this.resize();
	},
	methods: {
		start(event) {
			if (this.readOnly) {
				return;
			}
			this.dragActive = true;
			this.move(event);
		},
		end(event) {
			if (this.readOnly) {
				return;
			}
			this.move(event);
			this.dragActive = false;
		},
		move(event) {
			if (this.readOnly) {
				return;
			}
			// event.preventDefault();
			if (this.$options.animation.animationFrame || !this.dragActive) {
				return;
			}
			this.$options.animation.animationFrame = window.requestAnimationFrame(
				() => {
					const { x, y } = this.getRelativeEventPosition(event);
					this.x = x;
					this.y = y;
					this.$options.animation.animationFrame = undefined;
				}
			);
		},
		resize() {
			if (!this.$refs.picker) {
				return;
			}
			const boundingBox = this.$refs.picker.getBoundingClientRect();
			this.$options.animation.minX = boundingBox.left;
			this.$options.animation.minY = boundingBox.top;
			this.$options.animation.maxX = boundingBox.right;
			this.$options.animation.maxY = boundingBox.bottom;
		},
		_getEventPosition(event) {
			// mouse
			if (event.x !== undefined && event.y !== undefined) {
				return { x: event.x, y: event.y };
			}
			// touch
			return {
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
			};
		},
		getRelativeEventPosition(event) {
			const { minX, maxX, minY, maxY } = this.$options.animation;
			const { x, y } = this._getEventPosition(event);
			const newX = Math.min(Math.max(minX, x), maxX);
			const newY = Math.min(Math.max(minY, y), maxY);
			return {
				x: (newX - minX) / (maxX - minX),
				y: 1 - (newY - minY) / (maxY - minY),
			};
		},
		getColorForPosition({ x, y }) {
			const cL = this.hex2rgb(this.colorLeft);
			const cR = this.hex2rgb(this.colorRight);
			const currentColor = {
				r: cL.r + (cR.r - cL.r) * x,
				g: cL.g + (cR.g - cL.g) * x,
				b: cL.b + (cR.b - cL.b) * x,
			};
			currentColor.r = Math.round(currentColor.r * y);
			currentColor.g = Math.round(currentColor.g * y);
			currentColor.b = Math.round(currentColor.b * y);
			return this.rgb2hex(currentColor);
		},
		getPositionForChannels([a, b]) {
			const minMax = (min, max, val) => Math.max(min, Math.min(max, val));
			const scaleFactor = a >= b ? 1 / a || 0 : 1 / b || 0;
			const scaledValues = [a * scaleFactor, b * scaleFactor];
			const x = minMax(0, 1, (scaledValues[1] - scaledValues[0] + 1) / 2 || 0);
			const y = minMax(0, 1, a + b);
			return { x, y };
		},
	},
};
</script>

<style lang="scss" scoped>
$height: 32px;
$borderWidth: 2px;

.tone-picker {
	position: relative;
	width: 100%;
	padding-bottom: 100%;
	border-radius: 4px;
	&:after {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: "";
		background: linear-gradient(to bottom, transparent 0%, #000 100%);
		border-radius: 4px;
	}
}

.marker {
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 2;
	display: inline-block;
	padding: ($height / 2) - $borderWidth;
	margin-bottom: -($height / 2);
	margin-left: -($height / 2);
	border: $borderWidth solid var(--color-border-i, #fff);
	border-radius: 50%;

	&.active {
		box-shadow: 0 0 0 2px var(--color-border, #333),
			0 0 0 2px var(--color-border, #333) inset;
	}
}
</style>
