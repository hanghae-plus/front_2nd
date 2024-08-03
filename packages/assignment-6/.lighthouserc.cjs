module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start", // 서버를 키는 명령어를 통해서도 실행 가능
      url: ["http://localhost:5173"],
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci_reports",
    },
  },
};
