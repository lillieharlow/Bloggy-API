module.exports = {
  reporters: [
    "default",
    [ "jest-junit", { outputName: "test-results.xml" } ]
  ],
};