module.exports = {
  ci: {
    collect: {
      staticDistDir: "./packages/assignment-6/dist",
      url: ["http://localhost:3000"],
      numberOfRuns: 5,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
