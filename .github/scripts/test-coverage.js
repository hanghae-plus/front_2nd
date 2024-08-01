const reportTestSuccess = async ({ totalCoverage, github, context }) => {
  const coverageComment = `
## 테스트 성공 ✅
### 커버리지 결과

- 라인 커버리지: ${totalCoverage.lines.pct}%
- 브랜치 커버리지: ${totalCoverage.branches.pct}%
- 함수 커버리지: ${totalCoverage.functions.pct}%
- 구문 커버리지: ${totalCoverage.statements.pct}%
`;

  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: coverageComment,
  });
};

const reportTestFailure = async ({ github, context }) => {
  const coverageComment = `
## 테스트 실패 ❌

테스트 코드를 확인해주세요.
`;
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: coverageComment,
  });
};

module.exports = {
  reportTestSuccess,
  reportTestFailure,
};
