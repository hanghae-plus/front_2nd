module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      preset: "lighthouse:recommended",
    },
  },
};
