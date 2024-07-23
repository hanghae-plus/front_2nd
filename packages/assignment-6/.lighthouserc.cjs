module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start", // 서버를 키는 명령어를 통해서도 실행 가능
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
