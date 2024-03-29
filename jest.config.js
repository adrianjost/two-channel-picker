module.exports = {
	collectCoverage: true,
	coverageDirectory: "./coverage/",
	// resolves from test to snapshot path
	snapshotResolver: "./snapshotResolver.js",
	testMatch: ["<rootDir>/src/**/*.test.js"],
};
