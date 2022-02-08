module.exports = {
	root: true,
	parser: "vue-eslint-parser",

	parserOptions: {
		parser: "@babel/eslint-parser",
		sourceType: "module",
	},

	env: {
		node: true,
	},

	extends: ["plugin:vue/recommended", "prettier", "@vue/prettier"],

	rules: {
		"vue/require-prop-types": "error",
		// Only allow debugger in development
		"no-debugger":
			process.env.NODE_ENV === "production" || process.env.PRE_COMMIT
				? "error"
				: "off",
		// Only allow `console.log` in development
		"no-console":
			process.env.NODE_ENV === "production" || process.env.PRE_COMMIT
				? [
						"error",
						{
							allow: ["warn", "error"],
						},
				  ]
				: "off",

		"vue/component-name-in-template-casing": [
			"error",
			"PascalCase",
			{
				ignores: [
					"component",
					"template",
					"transition",
					"transition-group",
					"keep-alive",
					"slot",
					"vue-fab",
					"fab-item",
				],
			},
		],
	},
};
