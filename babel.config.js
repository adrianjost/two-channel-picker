exports =
	process.env.BUILD_TARGET === "helpers"
		? {
				presets: [
					[
						"@babel/env",
						{
							targets: {
								node: "current",
								browsers: "> 0.25%, not dead",
							},
							modules: "commonjs",
						},
					],
				],
		  }
		: {
				presets: ["@vue/app"],
		  };
module.exports = exports;
