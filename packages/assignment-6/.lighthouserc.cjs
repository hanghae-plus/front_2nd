module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
      startServerCommand: "pnpm run preview",
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-results", // 결과가 저장될 디렉토리
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
    assert: {
      preset: "lighthouse:recommended",
    },
  },
};
