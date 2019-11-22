import { matrix, multiply, lusolve } from "mathjs";

function componentToHex(color) {
	var hex = color.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

export const hex2rgb = (hexColor) => {
	// remove leading #
	if (hexColor.length === 7 || hexColor.length === 4) {
		hexColor = hexColor.substr(1);
	}
	// convert 3 digit to 6 digit color
	if (hexColor.length === 3) {
		hexColor =
			hexColor[0] +
			hexColor[0] +
			hexColor[1] +
			hexColor[1] +
			hexColor[2] +
			hexColor[2];
	}
	const bigint = parseInt(hexColor, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return { r: r, g: g, b: b };
};

export const rgb2hex = ({ r, g, b }) => {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const colorToChannel = (
	mapping = { r: 1, g: 2, b: 3 },
	{ r, g, b } = {}
) => {
	const out = {};
	out[mapping["r"]] = r;
	out[mapping["g"]] = g;
	out[mapping["b"]] = b;
	return out;
};

export const scaleColor = (FROM_A, TO_A, FROM_B, TO_B, COLOR) => {
	const COLOR_RGB = hex2rgb(COLOR);
	const FROM_A_RGB = hex2rgb(FROM_A);
	const TO_A_RGB = hex2rgb(TO_A);
	const FROM_B_RGB = hex2rgb(FROM_B);
	const TO_B_RGB = hex2rgb(TO_B);

	const convertMatrix = lusolve(
		[
			[FROM_A_RGB.g, FROM_A_RGB.b, 0, 0, 0, 0],
			[0, 0, FROM_A_RGB.g, FROM_A_RGB.b, 0, 0],
			[0, 0, 0, 0, FROM_A_RGB.g, FROM_A_RGB.b],
			[TO_A_RGB.g, TO_A_RGB.b, 0, 0, 0, 0],
			[0, 0, TO_A_RGB.g, TO_A_RGB.b, 0, 0],
			[0, 0, 0, 0, TO_A_RGB.g, TO_A_RGB.b],
		],
		[
			[FROM_B_RGB.r],
			[FROM_B_RGB.g],
			[FROM_B_RGB.b],
			[TO_B_RGB.r],
			[TO_B_RGB.g],
			[TO_B_RGB.b],
		]
	);
	const normalizedConvertMatrix = matrix([
		[0, convertMatrix[0][0], convertMatrix[1][0]],
		[0, convertMatrix[2][0], convertMatrix[3][0]],
		[0, convertMatrix[4][0], convertMatrix[5][0]],
	]);
	const colorMatrix = matrix([[COLOR_RGB.r], [COLOR_RGB.g], [COLOR_RGB.b]]);

	const scaledColorMatrix = multiply(normalizedConvertMatrix, colorMatrix);
	const scaledColor = {
		r: Math.max(0, Math.round(scaledColorMatrix.get([0, 0]))),
		g: Math.max(0, Math.round(scaledColorMatrix.get([1, 0]))),
		b: Math.max(0, Math.round(scaledColorMatrix.get([2, 0]))),
	};
	return rgb2hex(scaledColor);
};

export default {
	methods: {
		hex2rgb,
		rgb2hex,
		colorToChannel,
		scaleColor,
	},
};
