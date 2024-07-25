module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000'],
            startServerCommand: 'pnpm -F assignment-6 start',
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
