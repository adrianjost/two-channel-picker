import { hex2rgb, rgb2hex } from "./colorConversion.js";

export const getChannelsForHueAndBrightness = ({ hue, brightness }) => {
	const maxA = hue < 0.5 ? 1 : (1 - hue) * 2;
	const maxB = hue > 0.5 ? 1 : hue * 2;
	return [maxA * brightness, maxB * brightness];
};

export const getHueAndBrightnessForChannels = ([a, b]) => {
	const minMax = (min, max, val) => Math.max(min, Math.min(max, val));
	const scaleFactor = a >= b ? 1 / a || 0 : 1 / b || 0;
	const scaledValues = [a * scaleFactor, b * scaleFactor];
	const hue = minMax(0, 1, (scaledValues[1] - scaledValues[0] + 1) / 2 || 0);
	const brightness = minMax(0, 1, 1 / scaleFactor);
	return { hue, brightness };
};

const getLinearScaledColorValue = (colorA, colorB, position) => {
	const cA = hex2rgb(colorA);
	const cB = hex2rgb(colorB);
	const mixedColor = {
		r: cA.r + (cB.r - cA.r) * position,
		g: cA.g + (cB.g - cA.g) * position,
		b: cA.b + (cB.b - cA.b) * position,
	};
	return mixedColor;
};

export const getCenterColor = (colorA, colorB) => {
	const cA = hex2rgb(colorA);
	const cB = hex2rgb(colorB);
	const maxColor = (v1, v2) => {
		const s = v1 + v2;
		return s > 255 ? 255 : s;
	};
	return rgb2hex({
		r: maxColor(cA.r, cB.r),
		g: maxColor(cA.g, cB.g),
		b: maxColor(cA.b, cB.b),
	});
};

export const getColorForHueAndBrightness = ({
	colorA,
	colorB,
	hue,
	brightness,
}) => {
	let newColor;
	if (hue < 0.5) {
		newColor = getLinearScaledColorValue(
			colorA,
			getCenterColor(colorA, colorB),
			hue * 2
		);
	} else {
		newColor = getLinearScaledColorValue(
			getCenterColor(colorA, colorB),
			colorB,
			(hue - 0.5) * 2
		);
	}
	newColor.r = Math.round(newColor.r * brightness);
	newColor.g = Math.round(newColor.g * brightness);
	newColor.b = Math.round(newColor.b * brightness);
	return rgb2hex(newColor);
};

/**
 * Get the color that would be displayed by the color Picker for given channel values
 * @param  {Array}   channels    [channelA, channelB], each channel must have a value between 0 and 1
 * @param  {String}  colorA      a # prefixed hex color with 3 or 6 digits
 * @param  {String}  colorB      a # prefixed hex color with 3 or 6 digits
 * @return {String}              the visible color as a # prefixed hex color with 6 digits
 */
export const getColorForChannels = (
	channels,
	colorA = "#fd9",
	colorB = "#9df"
) => {
	const { hue, brightness } = getHueAndBrightnessForChannels(channels);
	return getColorForHueAndBrightness({
		colorA,
		colorB,
		hue,
		brightness,
	});
};

/**
 * Get the channel values that the picker would calculate for a given color
 * @param  {String}  color  a # prefixed hex color with 3 or 6 digits.
 * @return {Array}          [channelA, channelB], each channel has a value between 0 and 1
 */
/*
export const getChannelsForColor = (color) => {};
*/
