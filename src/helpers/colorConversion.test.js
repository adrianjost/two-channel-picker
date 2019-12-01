import { hex2rgb, rgb2hex } from "./colorConversion";

describe("colorConversion", () => {
	describe("back and forth", () => {
		it("#fff", () => {
			expect(rgb2hex(hex2rgb("#fff"))).toBe("#ffffff");
		});
		it("#000", () => {
			expect(rgb2hex(hex2rgb("#000"))).toBe("#000000");
		});
		it("#f00", () => {
			expect(rgb2hex(hex2rgb("#f00"))).toBe("#ff0000");
		});
	});
	describe("without hash", () => {
		it("fff", () => {
			expect(rgb2hex(hex2rgb("fff"))).toBe("#ffffff");
		});
	});
	describe("hex2rgb", () => {
		describe("3 digits", () => {
			it("#fff", () => {
				expect(hex2rgb("#fff")).toMatchSnapshot();
			});
			it("#000", () => {
				expect(hex2rgb("#000")).toMatchSnapshot();
			});
			it("#f00", () => {
				expect(hex2rgb("#f00")).toMatchSnapshot();
			});
		});
		describe("6 digits", () => {
			it("#ffffff", () => {
				expect(hex2rgb("#ffffff")).toMatchSnapshot();
			});
			it("#000000", () => {
				expect(hex2rgb("#000000")).toMatchSnapshot();
			});
			it("#ff0000", () => {
				expect(hex2rgb("#ff0000")).toMatchSnapshot();
			});
		});
	});
});
