module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.4 }],
        'categories:accessibility': ['warn', { minScore: 0.4 }],
        'categories:best-practices': ['warn', { minScore: 0.4 }],
        'categories:seo': ['warn', { minScore: 0.4 }],
      },
    },
  },
};
