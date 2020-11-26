import { EOL } from 'os';
import semver from 'semver';

import { api } from '../service';
import { loading, logging } from '../utility';
import { IReleaseProcessConfig } from './types';

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

const generateReleaseNote = async (
  branch: string,
  latestTagCommitHash: string,
  isGenerateFromPr = true,
) => {
  const { html_url, list: commitList } = await api.getCommitList(
    branch,
    latestTagCommitHash,
  );
  const list = isGenerateFromPr
    ? await api.getPullRequestList(branch)
    : commitList;

  const milestones: string[] = ['#### Milestone'];
  const changelogs: string[] = ['#### Changelogs'];

  list.map(({ title, sha, prNumber, milestoneHtmlUrl }) => {
    changelogs.push(
      `* ${title} ` +
        (prNumber ? `(#${prNumber}) ` : ``) +
        `${sha ? sha.substr(0, 7) : ''}`,
    );

    if (milestoneHtmlUrl && !milestones.includes(milestoneHtmlUrl)) {
      milestones.push(milestoneHtmlUrl);
    }
  });

  const releaseContentArraryToText = (arr: string[]) =>
    arr.length > 1 ? `${arr.join(EOL)}${EOL}${EOL}` : '';

  return list.length === 0
    ? 'Empty Changelog'
    : releaseContentArraryToText(changelogs) +
        releaseContentArraryToText(milestones) +
        html_url;
};

export const prepareReleaseAction = async (
  releaseBranch: string,
  config: IReleaseProcessConfig,
) => {
  const title = `generate the release note content`;
  let result;

  try {
    loading.start(title);

    const { tag: prevTag, sha: prevTagSha } = await api.getLatestTag();

    const note = await generateReleaseNote(
      releaseBranch,
      prevTagSha,
      releaseBranch !== config.basicBranches.master,
    );
    const newTag = getReleaseTagName(prevTag, config);

    result = {
      prevTag,
      newTag,
      note,
    };
  } finally {
    loading.stop();
  }

  logging.success(`success ${title}`);
  return result;
};

export const updatePackageVersionAction = async (tagName: string) => {
  const title = `update the verion on package.json`;
  let result;

  try {
    loading.start(title);
    result = await api.updatePackageVersion(tagName);
  } finally {
    loading.stop();
  }

  logging.success(`success ${title}`);
  logging.url(result.html_url);

  return result.sha;
};

export const createReleaseAction = async (
  newTag: string,
  verionUpdateSha: string,
  note: string,
) => {
  const title = `create release and tag`;
  let html_url;

  try {
    loading.start(title);
    html_url = await api.createRelease(newTag, verionUpdateSha, note);
  } finally {
    loading.stop();
  }

  logging.success(`success ${title}`);
  logging.url(html_url);
};
