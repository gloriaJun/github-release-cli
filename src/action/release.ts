import { EOL } from 'os';

import { createRelease, getLatestTag, getPullRequestList } from '../api';
import { askReleaseProcess } from '../inquirer';
import { IGitFlowBranchInfo } from '../interface';
import { logging } from '../utility';

const generateReleaseNote = async (branch: string) => {
  const data = await getPullRequestList(branch);

  const milestones: string[] = ['#### Milestone'];
  const changelogs: string[] = ['#### Changelogs'];

  data.map((item) => {
    const { title, number, merge_commit_sha, milestone } = item;

    changelogs.push(`* ${title} (#${number}) ${merge_commit_sha.substr(0, 7)}`);

    if (!milestones.includes(milestone.html_url)) {
      milestones.push(milestone.html_url);
    }
  });

  const getArraryText = (arr: string[]) =>
    arr.length > 1 ? arr.join(EOL) : '';

  return getArraryText(changelogs) + EOL + EOL + getArraryText(milestones);
};

export const createReleaseNote = async (branch: string) => {
  const latestTagVersion = await getLatestTag();
  logging.stepTitle(`Do Release Process ...`, `(${latestTagVersion} ~ aa)`);

  const note = await generateReleaseNote(branch);
  logging.preview({ text: note });
};

export const releaseAction = async (
  gitFlowBranchInfo: IGitFlowBranchInfo,
  relBranch: string,
) => {
  const config = await askReleaseProcess(gitFlowBranchInfo, relBranch);
  const { html_url } = await createRelease(config);
  return html_url;
};
