require('dotenv').config()

module.exports = {
    ci: {
        collect: {
            startServerCommand: "pnpm -F assignment-6 start",
            url: [process.env.VITE_HOST+'/'],
            numberOfRuns: 5,
            settings: {
                preset: "desktop",
            },
        },
        upload: {
            target: "filesystem",
            staticDistDir: "./packages/assignment-6/dist",
            outputDir: "./lhci_reports",
            reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
        },
    },
};
