import {
	getCenterColor,
	getChannelsForHueAndBrightness,
	getColorForHueAndBrightness,
	getColorForChannels,
	getHueAndBrightnessForChannels,
} from "./channelColor";

const testColorA = "#fd9";
const testColorB = "#9df";

describe("channelColor.js", () => {
	describe("getCenterColor", () => {
		it("#fd9 #9df", () => {
			expect(getCenterColor("#fd9", "#9df")).toMatchSnapshot();
		});
		it("#ffdd99 #99ddff", () => {
			expect(getCenterColor("#ffdd99", "#99ddff")).toMatchSnapshot();
		});
		it("#f00 #00f", () => {
			expect(getCenterColor("#f00", "#00f")).toMatchSnapshot();
		});
	});

	describe("getChannelsForHueAndBrightness", () => {
		it("min Hue max Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 0, brightness: 1 })
			).toMatchSnapshot();
		});
		it("mid Hue max Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 0.5, brightness: 1 })
			).toMatchSnapshot();
		});
		it("max Hue max Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 1, brightness: 1 })
			).toMatchSnapshot();
		});

		it("min Hue mid Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 0, brightness: 0.5 })
			).toMatchSnapshot();
		});
		it("mid Hue mid Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 0.5, brightness: 0.5 })
			).toMatchSnapshot();
		});
		it("max Hue mid Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 1, brightness: 0.5 })
			).toMatchSnapshot();
		});

		it("min Hue min Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 0, brightness: 0 })
			).toMatchSnapshot();
		});
		it("mid Hue min Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 0.5, brightness: 0 })
			).toMatchSnapshot();
		});
		it("max Hue min Brightness", () => {
			expect(
				getChannelsForHueAndBrightness({ hue: 1, brightness: 0 })
			).toMatchSnapshot();
		});
	});

	describe("getColorForHueAndBrightness", () => {
		it("min Hue max Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 0,
					brightness: 1,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
		it("mid Hue max Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 0.5,
					brightness: 1,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
		it("max Hue max Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 1,
					brightness: 1,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});

		it("min Hue mid Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 0,
					brightness: 0.5,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
		it("mid Hue mid Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 0.5,
					brightness: 0.5,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
		it("max Hue mid Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 1,
					brightness: 0.5,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});

		it("min Hue min Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 0,
					brightness: 0,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
		it("mid Hue min Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 0.5,
					brightness: 0,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
		it("max Hue min Brightness", () => {
			expect(
				getColorForHueAndBrightness({
					hue: 1,
					brightness: 0,
					colorA: testColorA,
					colorB: testColorB,
				})
			).toMatchSnapshot();
		});
	});

	describe("getColorForChannels", () => {
		it("[1, 1] with default colors", () => {
			expect(getColorForChannels([1, 0])).toMatchSnapshot();
		});

		it("[1, 0]", () => {
			expect(
				getColorForChannels([1, 0], testColorA, testColorB)
			).toMatchSnapshot();
		});
		it("[1, 1]", () => {
			expect(
				getColorForChannels([1, 1], testColorA, testColorB)
			).toMatchSnapshot();
		});
		it("[0, 1]", () => {
			expect(
				getColorForChannels([0, 1], testColorA, testColorB)
			).toMatchSnapshot();
		});
		it("[0.5, 0.25]", () => {
			expect(
				getColorForChannels([0.5, 0.25], testColorA, testColorB)
			).toMatchSnapshot();
		});
		it("[0.5, 0.5]", () => {
			expect(
				getColorForChannels([0.5, 0.5], testColorA, testColorB)
			).toMatchSnapshot();
		});
		it("[0.25, 0.5]", () => {
			expect(
				getColorForChannels([0.25, 0.5], testColorA, testColorB)
			).toMatchSnapshot();
		});
		it("[0, 0]", () => {
			expect(
				getColorForChannels([0, 0], testColorA, testColorB)
			).toMatchSnapshot();
		});
	});

	describe("getHueAndBrightnessForChannels", () => {
		it("[1, 0]", () => {
			expect(getHueAndBrightnessForChannels([1, 0])).toMatchSnapshot();
		});
		it("[1, 1]", () => {
			expect(getHueAndBrightnessForChannels([1, 1])).toMatchSnapshot();
		});
		it("[0, 1]", () => {
			expect(getHueAndBrightnessForChannels([0, 1])).toMatchSnapshot();
		});
		it("[0.5, 0.25]", () => {
			expect(getHueAndBrightnessForChannels([0.5, 0.25])).toMatchSnapshot();
		});
		it("[0.5, 0.5]", () => {
			expect(getHueAndBrightnessForChannels([0.5, 0.5])).toMatchSnapshot();
		});
		it("[0.25, 0.5]", () => {
			expect(getHueAndBrightnessForChannels([0.25, 0.5])).toMatchSnapshot();
		});
		it("[0.25, 0]", () => {
			expect(getHueAndBrightnessForChannels([0.25, 0])).toMatchSnapshot();
		});
		it("[0, 0]", () => {
			expect(getHueAndBrightnessForChannels([0, 0])).toMatchSnapshot();
		});
		it("[0, 0.25]", () => {
			expect(getHueAndBrightnessForChannels([0, 0.25])).toMatchSnapshot();
		});
	});
});
