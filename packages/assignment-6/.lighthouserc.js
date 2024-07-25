module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm -F assignment-6 start',
      staticDistDir: './dist',
      url: ['http://localhost:5173'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
