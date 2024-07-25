function processTestResults(testStatus, coverageSummary) {
  let comment = '';

  if (testStatus === 'success') {
    const coverage = JSON.parse(coverageSummary);
    const { total } = coverage;

    comment = `## ✅ 테스트 성공 
    \n### 커버리지 결과
    • 라인 커버리지: ${total.lines.pct}%
    • 구문 커버리지: ${total.statements.pct}%
    • 함수 커버리지: ${total.functions.pct}%
    • 브랜치 커버리지: ${total.branches.pct}%`;
  } else {
    comment = `## ❌ 테스트 실패`;
  }

  return comment;
}

module.exports = processTestResults;
