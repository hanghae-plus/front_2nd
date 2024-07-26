module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start",
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
    },
    upload: {
      // 레포트 생성
      target: "filesystem",
      outputDir: "./lhci_reports",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
