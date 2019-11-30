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
			:style="{
				background: backgroundGradient,
			}"
			@touchstart="start"
			@mousedown="start"
			class="tone-picker"
		>
			<div
				ref="marker"
				:class="{ marker: true, active: dragActive }"
				:style="{
					background: currentColor,
					transform: translate,
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
			marker: {
				x: 1,
				y: 1,
			},
			frame: {
				minX: 0,
				maxX: 1,
				minY: 0,
				maxY: 1,
			},
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
				x: this.marker.x,
				y: this.marker.y,
			});
		},
		translate() {
			return this.getTranslate(this.marker.x, this.marker.y);
		},
		colorMid() {
			const cA = this.hex2rgb(this.colorLeft);
			const cB = this.hex2rgb(this.colorRight);
			const maxColor = (v1, v2) => {
				const s = v1 + v2;
				return s > 255 ? 255 : s;
			};
			return this.rgb2hex({
				r: maxColor(cA.r, cB.r),
				g: maxColor(cA.g, cB.g),
				b: maxColor(cA.b, cB.b),
			});
		},
		backgroundGradient() {
			return `linear-gradient(to right, ${this.colorLeft} 0%, ${this.colorMid} 50%, ${this.colorRight} 100%)`;
		},
	},
	watch: {
		currentColor(to) {
			const channels = this.getChannelsForPosition(this.marker);
			this.$emit("input", channels);
		},
		value: {
			immediate: true,
			handler(values) {
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
				this.marker = this.getPositionForChannels(values);
			},
		},
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		this.resize();
	},
	methods: {
		/*
			START MARKER POSITIONING
		*/
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
					this.marker.x = x;
					this.marker.y = y;
					this.$options.animation.animationFrame = undefined;
				}
			);
		},
		resize() {
			if (!this.$refs.picker) {
				return;
			}
			const boundingBox = this.$refs.picker.getBoundingClientRect();
			this.frame.minX = boundingBox.left;
			this.frame.minY = boundingBox.top;
			this.frame.maxX = boundingBox.right;
			this.frame.maxY = boundingBox.bottom;
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
			const { minX, maxX, minY, maxY } = this.frame;
			const { x, y } = this._getEventPosition(event);
			const newX = Math.min(Math.max(minX, x), maxX);
			const newY = Math.min(Math.max(minY, y), maxY);
			return {
				x: (newX - minX) / (maxX - minX),
				y: 1 - (newY - minY) / (maxY - minY),
			};
		},
		getTranslate(posX, posY) {
			const x = posX * (this.frame.maxX - this.frame.minX);
			const y = -posY * (this.frame.maxY - this.frame.minY);
			return `translate(${x}px, ${y}px)`;
		},
		/*
			END MARKER POSITIONING
		*/
		/*
			START MARKER COLOR
		*/
		getColorBetweenColors(colorA, colorB, position) {
			const cA = this.hex2rgb(colorA);
			const cB = this.hex2rgb(colorB);
			const mixedColor = {
				r: cA.r + (cB.r - cA.r) * position,
				g: cA.g + (cB.g - cA.g) * position,
				b: cA.b + (cB.b - cA.b) * position,
			};
			return mixedColor;
		},
		getColorForPosition({ x, y }) {
			let newColor;
			if (x < 0.5) {
				newColor = this.getColorBetweenColors(
					this.colorLeft,
					this.colorMid,
					x * 2
				);
			} else {
				newColor = this.getColorBetweenColors(
					this.colorMid,
					this.colorRight,
					(x - 0.5) * 2
				);
			}
			newColor.r = Math.round(newColor.r * y);
			newColor.g = Math.round(newColor.g * y);
			newColor.b = Math.round(newColor.b * y);
			return this.rgb2hex(newColor);
		},
		/*
			END MARKER COLOR
		*/
		/* START V-MODEL CALCULATIONS */
		getChannelsForPosition({ x, y }) {
			const maxA = x < 0.5 ? 1 : (1 - x) * 2;
			const maxB = x > 0.5 ? 1 : x * 2;
			return [maxA * y, maxB * y];
		},
		getPositionForChannels([a, b]) {
			const minMax = (min, max, val) => Math.max(min, Math.min(max, val));
			const scaleFactor = a >= b ? 1 / a || 0 : 1 / b || 0;
			const scaledValues = [a * scaleFactor, b * scaleFactor];
			const x = minMax(0, 1, (scaledValues[1] - scaledValues[0] + 1) / 2 || 0);
			const y = minMax(0, 1, 1 / scaleFactor);
			return { x, y };
		},
		/* END V-MODEL CALCULATIONS */
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
