const reportLintSuccess = async ({ context, github }) => {
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: `Lint 성공 🎉`,
  });
};

const reportLintFailure = async ({ eslintReport, context, github }) => {
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: `
## ESLint Results

${eslintReport}
`,
  });
};

module.exports = {
  reportLintSuccess,
  reportLintFailure,
};
