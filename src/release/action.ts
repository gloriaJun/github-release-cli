import { EOL } from 'os';
import semver from 'semver';

import { api } from '../service';
import {
  inquirerContinueProcess,
  isNotEmpty,
  loading,
  logging,
} from '../utility';
import { IReleaseProcessConfig } from './types';

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
  const list = await api.getPullRequestList(branch);
  const { html_url } = await api.getCommitList(branch, latestTagCommitHash);

  const milestones: string[] = ['#### Milestone'];
  const changelogs: string[] = ['#### Changelogs'];

  list.map(({ title, number, sha, milestoneHtmlUrl }) => {
    changelogs.push(`* ${title} (#${number}) ${sha ? sha.substr(0, 7) : ''}`);

    if (milestoneHtmlUrl && !milestones.includes(milestoneHtmlUrl)) {
      milestones.push(milestoneHtmlUrl);
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
  const { html_url, list } = await api.getCommitList(
    branch,
    latestTagCommitHash,
  );

  const changelogs: string[] = ['#### Changelogs'];

  list.map(({ title, sha }) => {
    changelogs.push(`* ${title} ${sha.substr(0, 7)}`);
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

  const { tag: latestTag, sha: latestTagSha } = await api.getLatestTag();

  const note = await generateReleaseNote(
    releaseBranch,
    latestTagSha,
    releaseBranch !== basicBranches.master,
  );
  logging.preview({ text: note });
  const tagName = getReleaseTagName(latestTag, config);
  await confirmCreateTag(latestTag, tagName);

  try {
    loading.start(`create the tag`);
    const html_url = await api.createRelease(
      tagName,
      basicBranches.master,
      note,
    );
    logging.success(`Success release ${tagName} from ${releaseBranch} 🎉🎉🎉`);
    logging.url(html_url);
  } finally {
    loading.stop();
  }
};
