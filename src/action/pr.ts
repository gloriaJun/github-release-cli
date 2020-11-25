import { createPullRequest, mergePullRequest } from '../api';
import { askPullRequestProcess } from '../inquirer';
import { IGitFlowBranchInfo } from '../interface';
import { inquirerConfirmQuestion, logging } from '../utility';

export const pullRequestAction = async (
  prefixLsit: string[],
  gitFlowBranchInfo: IGitFlowBranchInfo,
) => {
  logging.stepTitle(`Start create pr & mege process ...`);

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
      logging.success(`Pull Request successfully merged to ${branch} 👍`);
    } else {
      logging.success(`Create Pull Request to ${branch} 👍`);
    }
    logging.url(html_url);
  });

  await Promise.all(promises);

  return relBranch;
};
