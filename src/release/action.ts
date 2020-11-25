import { EOL } from 'os';
import semver from 'semver';

import {
  createRelease,
  getCommitList,
  getLatestTag,
  getPullRequestList,
} from '../api';
import {
  getToday,
  inquirerContinueProcess,
  isNotEmpty,
  loading,
  logging,
} from '../utility';
import { IReleaseProcessConfig } from './interface';

const releaseContentArraryToText = (arr: string[]) =>
  arr.length > 1 ? `${arr.join(EOL)}${EOL}${EOL}` : '';

const confirmCreateTag = async (lastestTag: string, newTag: string) => {
  await inquirerContinueProcess(
    [
      `Do you want to create the tag `,
      '(',
      isNotEmpty(lastestTag) ? `${lastestTag} -> ` : '',
      newTag,
      ')',
      ' ?',
    ].join(''),
  );
};

const getReleaseTagName = (
  latestTag: string,
  { releaseType, tagPrefix }: IReleaseProcessConfig,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,,@typescript-eslint/no-unsafe-call
  const newTag = [
    tagPrefix,
    semver.inc(latestTag || '0.0.0', releaseType),
  ].join('');

  return newTag;
};

const generateReleaseNoteFromPr = async (
  branch: string,
  latestTagCommitHash: string,
) => {
  const data = await getPullRequestList(branch);
  const { html_url } = await getCommitList(latestTagCommitHash, branch);

  const milestones: string[] = ['#### Milestone'];
  const changelogs: string[] = ['#### Changelogs'];

  data.map((item) => {
    const { title, number, merge_commit_sha, milestone } = item;

    changelogs.push(
      `* ${title} (#${number}) ${
        merge_commit_sha ? merge_commit_sha.substr(0, 7) : ''
      }`,
    );

    if (milestone && !milestones.includes(milestone.html_url)) {
      milestones.push(milestone.html_url);
    }
  });

  return (
    releaseContentArraryToText(changelogs) +
    releaseContentArraryToText(milestones) +
    html_url
  );
};

const generateReleaseNoteFromCommit = async (
  branch: string,
  latestTagCommitHash: string,
) => {
  const { html_url, commits } = await getCommitList(
    latestTagCommitHash,
    branch,
  );

  const changelogs: string[] = ['#### Changelogs'];

  commits.map((item) => {
    const { commit, sha } = item;
    const message = commit.message.replace(new RegExp(EOL + EOL, 'g'), EOL);

    changelogs.push(`* ${message} ${sha.substr(0, 7)}`);
  });

  return releaseContentArraryToText(changelogs) + html_url;
};

const generateReleaseNote = async (
  branch: string,
  latestTagCommitHash: string,
  isGenerateFromPr: boolean,
) => {
  try {
    loading.start(`generate release content`);
    const note = !isGenerateFromPr
      ? await generateReleaseNoteFromPr(branch, latestTagCommitHash)
      : await generateReleaseNoteFromCommit(branch, latestTagCommitHash);

    logging.info(EOL);
    logging.success(`generated the release note content`);
    return note;
  } finally {
    loading.stop();
  }
};

export const createReleaseAction = async (
  releaseBranch: string,
  config: IReleaseProcessConfig,
) => {
  const { basicBranches } = config;

  logging.stepTitle(`Start create tag and release note from`, releaseBranch);

  const { name: latestTag, commit } = await getLatestTag();

  const note = await generateReleaseNote(
    releaseBranch,
    commit.sha,
    releaseBranch !== basicBranches.master,
  );
  logging.preview({ text: note });
  const tagName = getReleaseTagName(latestTag, config);
  await confirmCreateTag(latestTag, tagName);

  try {
    loading.start(`create the tag`);
    const { html_url } = await createRelease({
      tagName,
      releaseName: `${tagName} (${getToday()})`,
      targetCommitish: basicBranches.master,
      body: note,
    });
    logging.success(`Success release ${tagName} from ${releaseBranch} 🎉🎉🎉`);
    logging.url(html_url);
  } finally {
    loading.stop();
  }
};
