import { createPullRequest, mergePullRequest } from '../api';
import { askPullRequestProcess } from '../inquirer';
import { IGitFlowBranchInfo } from '../interface';
import { logging } from '../utility';

export const pullRequestAction = async (
  prefixLsit: string[],
  gitFlowBranchInfo: IGitFlowBranchInfo,
) => {
  const { relBranch, targetPrBranchInfo } = await askPullRequestProcess(
    prefixLsit,
    gitFlowBranchInfo,
  );

  const promises = Object.keys(targetPrBranchInfo).map(async (branch) => {
    const { isCreate, isMerge } = targetPrBranchInfo[branch];
    if (!isCreate) {
      return;
    }

    const { html_url, number } = await createPullRequest(
      `merge ${relBranch} to ${branch}`,
      relBranch,
      branch,
    );

    if (isMerge) {
      await mergePullRequest(number, branch);
      logging.info(
        `Pull Request successfully merged to ${branch} 👍 -> ${html_url}\n`,
      );
    } else {
      logging.info(`Create Pull Request to ${branch} 👍 -> ${html_url}\n`);
    }
  });

  await Promise.all(promises);

  return relBranch;
};
