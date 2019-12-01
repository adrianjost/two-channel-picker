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
					...getMarkerStyles(_options),
				}"
			/>
		</div>
	</div>
</template>

<script>
import colorConversion from "@/helpers/colorConversion.js";
import {
	getCenterColor,
	getChannelsForHueAndBrightness,
	getColorForHueAndBrightness,
	getHueAndBrightnessForChannels,
} from "@/helpers/channelColor.js";
import GlobalEvents from "vue-global-events";

export default {
	components: {
		GlobalEvents,
	},
	mixins: [colorConversion],
	props: {
		value: {
			type: [Array, String],
			default: () => [1, 0],
			validator: (v) => v[0] >= 0 && v[0] <= 1 && v[1] >= 0 && v[1] <= 1,
		},
		options: {
			type: Object,
			default: () => ({}),
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
	computed: {
		_options() {
			return {
				colorLeft: "#fd9",
				colorRight: "#9df",
				readOnly: false,
				marker: {
					radius: 16,
					borderWidth: 2,
				},
				...this.getTypesafeAttr(this.options),
			};
		},
		typeSafeValue() {
			return this.getTypesafeAttr(this.value);
		},
		currentColor() {
			return getColorForHueAndBrightness({
				colorA: this._options.colorLeft,
				colorB: this._options.colorRight,
				hue: this.marker.x,
				brightness: this.marker.y,
			});
		},
		translate() {
			return this.getTranslate(this.marker.x, this.marker.y);
		},
		colorMid() {
			return getCenterColor(this._options.colorLeft, this._options.colorRight);
		},
		backgroundGradient() {
			return `linear-gradient(to right, ${this._options.colorLeft} 0%, ${this.colorMid} 50%, ${this._options.colorRight} 100%)`;
		},
	},
	watch: {
		currentColor(to) {
			const channels = this.getChannelsForPosition(this.marker);
			this.$emit("input", channels, this.currentColor);
		},
		typeSafeValue: {
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
				this.marker = this.getPositionForChannels(values);
			},
		},
	},
	animation: {
		animationFrame: undefined,
		changeTimeout: undefined,
		hasChangedLately: false,
	},
	mounted() {
		window.addEventListener("resize", this.resize);
		setTimeout(this.resize, 0);
	},
	methods: {
		getTypesafeAttr(value) {
			try {
				if (typeof value === "string") {
					return JSON.parse(value);
				} else {
					return value;
				}
			} catch (error) {
				console.error(error);
			}
			console.error("unable to type convert attribute");
			return value;
		},
		/*
			START MARKER POSITIONING
		*/
		start(event) {
			if (this._options.readOnly) {
				return;
			}
			this.resize();
			this.dragActive = true;
			this.move(event);
		},
		end(event) {
			if (this._options.readOnly) {
				return;
			}
			this.move(event);
			this.dragActive = false;
		},
		move(event) {
			if (this._options.readOnly) {
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
			this.$forceUpdate();
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
		getMarkerStyles(options) {
			const { radius, borderWidth } = options.marker;
			return {
				padding: `${radius - borderWidth}px`,
				"margin-bottom": `${-radius}px`,
				"margin-left": `${-radius}px`,
				"border-width": `${borderWidth}px`,
			};
		},
		/* START V-MODEL CALCULATIONS */
		getChannelsForPosition({ x, y }) {
			return getChannelsForHueAndBrightness({
				hue: x,
				brightness: y,
			});
		},
		getPositionForChannels(channels) {
			const { hue, brightness } = getHueAndBrightnessForChannels(channels);
			return { x: hue, y: brightness };
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
	border: $borderWidth solid var(--color-border-i, #fff);
	border-radius: 50%;

	&.active {
		box-shadow: 0 0 0 2px var(--color-border, #333),
			0 0 0 2px var(--color-border, #333) inset;
	}
}
</style>
