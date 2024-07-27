module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start",
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci_reports",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
