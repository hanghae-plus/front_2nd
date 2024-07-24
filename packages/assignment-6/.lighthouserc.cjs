module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
      startServerCommand: "pnpm run preview",
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      preset: "lighthouse:recommended",
    },
  },
};
