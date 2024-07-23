module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm -F assignment-6 start",
      url: ["http://localhost:5173"],
      numberOfRuns: 5,
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci-results",
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
      },
    },
  },
};
