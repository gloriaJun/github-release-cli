import { api } from 'src/service';
import { loading, logging } from 'src/utility';
import { IBranchType } from 'src/types';

import { askPullRequestProcess } from './inquirer';

const pullRequestAction = async (
  prefixLsit: string[],
  gitFlowBranchInfo: IBranchType,
) => {
  logging.stepTitle(`Start create pr & merge process`);

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

export const runPullRequestProcess = async (basicBranches: IBranchType) => {
  try {
    await pullRequestAction(
      [basicBranches.release, basicBranches.hotfix],
      basicBranches,
    );
  } catch (error) {
    logging.newLine();
    logging.error(error);
  }
};
