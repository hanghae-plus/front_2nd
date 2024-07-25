module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost:5173'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
