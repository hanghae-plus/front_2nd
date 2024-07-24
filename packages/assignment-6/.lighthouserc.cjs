require('dotenv').config()

module.exports = {
    ci: {
        collect: {
            startServerCommand: "pnpm -F assignment-6 start",
            url: ["http://localhost:5137/"],
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
