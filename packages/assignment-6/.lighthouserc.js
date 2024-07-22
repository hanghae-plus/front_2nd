module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run build", // 서버를 키는 명령어를 통해서도 실행 가능
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
