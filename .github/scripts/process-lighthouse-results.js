function processLighthouseResults(resultsJson) {
  const results = JSON.parse(resultsJson);
  const latestRun = results.runs[results.runs.length - 1];
  const categories = latestRun.summary;

  let comment = '## 🚦 Lighthouse CI 결과\n\n';
  comment += '| Category | Score |\n';
  comment += '|----------|-------|\n';

  for (const [category, score] of Object.entries(categories)) {
    const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟠' : '🔴';
    comment += `| ${category} | ${emoji} ${score} |\n`;
  }

  comment += `\n자세한 결과: ${latestRun.url}`;

  return comment;
}

module.exports = processLighthouseResults;
