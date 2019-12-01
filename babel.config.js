exports =
	process.env.NODE_ENV !== "test"
		? {
				presets: ["@vue/app"],
		  }
		: {
				presets: [
					[
						"@babel/env",
						{
							targets: {
								node: "8",
							},
						},
					],
				],
		  };
module.exports = exports;
