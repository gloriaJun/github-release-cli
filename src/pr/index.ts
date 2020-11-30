import { api, IGitFlowBranch } from '../service';
import { inquirerConfirmQuestion, loading, logging } from '../utility';
import { askPullRequestProcess } from './inquirer';

export const pullRequestAction = async (
  prefixLsit: string[],
  gitFlowBranchInfo: IGitFlowBranch,
) => {
  logging.stepTitle(`Start create pr & merge process`);

  const answer = await inquirerConfirmQuestion({
    message: 'Do you want to create pr?',
    default: true,
  });
  if (!answer) {
    return;
  }

  const { relBranch, targetPrBranchInfo } = await askPullRequestProcess(
    prefixLsit,
    gitFlowBranchInfo,
  );

  try {
    loading.start(`create & merge pull reqquest from ${relBranch} branch`);

    const promises = Object.keys(targetPrBranchInfo).map(async (branch) => {
      const { isCreate, isMerge: isAllowMerge } = targetPrBranchInfo[branch];
      if (!isCreate) {
        return;
      }

      const { html_url, isMerged } = await api.createReleasePullRequest(
        relBranch,
        branch,
        isAllowMerge,
      );

      logging.success(
        `Pull Request successfully created ${
          isMerged ? '& merged ' : ''
        }to ${branch} 👍`,
      );
      logging.url(html_url);
    });

    await Promise.all(promises);

    return relBranch;
  } finally {
    loading.stop();
  }
};
