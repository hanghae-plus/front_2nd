const formatScore = (score) => Math.round(score * 100);
const getScoreEmoji = (score) =>
  score >= 90 ? "🟢" : score >= 50 ? "🟠" : "🔴";

const createMarkdownTable = (headers, rows) => {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
};

const createLighthouseComment = (summary, audits) => {
  const formattedSummary = Object.fromEntries(
    Object.entries(summary).map(([key, value]) => [key, formatScore(value)])
  );

  const summaryTable = createMarkdownTable(
    ["Category", "Score"],
    Object.entries(formattedSummary).map(([key, value]) => [
      `${getScoreEmoji(value)} ${key.charAt(0).toUpperCase() + key.slice(1)}`,
      value,
    ])
  );

  const detailRows = [
    "first-contentful-paint",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
  ].map((metric) => {
    const score = formatScore(audits[metric].score * 100);
    return [
      `${getScoreEmoji(score)} ${metric
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`,
      audits[metric].displayValue,
    ];
  });

  const detailTable = createMarkdownTable(["Category", "Score"], detailRows);

  return `
⚡️ Lighthouse report!
${summaryTable}

📊 Lighthouse Detail
${detailTable}
  `.trim();
};

const reportLighthouseSuccess = async ({ github, context, results, fs }) => {
  const comments = results
    .map((result) => {
      const { summary, jsonPath } = result;
      const { audits } = JSON.parse(fs.readFileSync(jsonPath));
      return createLighthouseComment(summary, audits);
    })
    .join("\n\n");

  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: comments,
  });
};

const reportLighthouseFailure = async ({ github, context }) => {
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: "빌드가 실패하여 Lighthouse 결과를 측정할 수 없습니다.",
  });
};

module.exports = {
  reportLighthouseSuccess,
  reportLighthouseFailure,
};
