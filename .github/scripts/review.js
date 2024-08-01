const getRandomReviewer = () => {
  const reviewers = ["yoosion030", "dhp94d", "lydiahjchung", "callipenguin"];
  const randomReviewer =
    reviewers[Math.floor(Math.random() * reviewers.length)];

  return randomReviewer;
};

const commentReviewer = async ({ github, context, reviewer }) => {
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: `@${reviewer}, 리뷰를 부탁드립니다.`,
  });
};

const assignReviewer = async ({ github, context, reviewer }) => {
  const currentReviewers = await github.rest.pulls.listRequestedReviewers({
    pull_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  if (currentReviewers.data.users.length > 0) {
    const reviewersToRemove = currentReviewers.data.users.map(
      (user) => user.login
    );
    await github.rest.pulls.removeRequestedReviewers({
      pull_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      reviewers: reviewersToRemove,
    });
  }

  await github.rest.pulls.requestReviewers({
    pull_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    reviewers: [reviewer],
  });
};

module.exports = {
  commentReviewer,
  assignReviewer,
  getRandomReviewer,
};
