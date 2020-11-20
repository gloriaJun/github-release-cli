import { createPullRequest, createRelease, mergePullRequest } from './api';
import { askPullRequestProcess, askReleaseProcess } from './inquirer';
import { IGitFlowBranchInfo } from './interface';
import { logging } from './utility';

export const pullRequestAction = async (
  prefix: string,
  gitFlowBranchInfo: IGitFlowBranchInfo,
) => {
  const { relBranch, targetPrBranchInfo } = await askPullRequestProcess(
    prefix,
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

export const releaseAction = async (
  gitFlowBranchInfo: IGitFlowBranchInfo,
  relBranch: string,
) => {
  const config = await askReleaseProcess(gitFlowBranchInfo, relBranch);
  const { html_url } = await createRelease(config);
  return html_url;
};
