require('dotenv').config()

module.exports = {
    ci: {
        collect: {
            startServerCommand: "pnpm -F assignment-6 start",
            url: [rocess.env.VITE_HOST],
            numOfRuns: 5,
            settings: {
                preset: "desktop",
            },
        },
        upload: {
            target: "filesystem",
            outputDir: "./lhci_reports",
            reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
        },
    },
};
