module.exports = {
	// resolves from test to snapshot path
	resolveSnapshotPath: (testPath, snapshotExtension) => {
		return testPath + snapshotExtension;
	},
	// resolves from snapshot to test path
	resolveTestPath: (snapshotFilePath, snapshotExtension) =>
		snapshotFilePath.slice(0, -snapshotExtension.length),

	// Example test path, used for preflight consistency check of the implementation above
	testPathForConsistencyCheck: "some/src/example.test.js",
};
