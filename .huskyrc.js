const tasks = (arr) => arr.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks(['lint-staged']),
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    // 'pre-push': tasks([
    //   'npm run lint',
    //   'npm run prettier:check',
    //   'npm run test',
    // ]),
  },
};
