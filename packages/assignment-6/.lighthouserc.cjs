module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost:5173"],
      numberOfRuns: 1,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
