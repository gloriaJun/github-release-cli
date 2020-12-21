import { EOL } from 'os';
import * as semver from 'semver';
import { RequestError } from '@octokit/types';

import { api } from 'src/service';
import { isEmpty, loading, logging } from 'src/utility';
import { IGitTag, IReleaseType } from 'src/types';

const parseErrormsg = (error: RequestError) => {
  if (error instanceof Error) {
    const { status, message, documentation_url } = error;

    return `[${status}] ${message}${EOL}- ${documentation_url}`;
  } else {
    return error;
  }
};

const getReleaseTagName = (
  latestTag: string,
  releaseType: string,
  prefix?: string,
) => {
  const newTag = [
    prefix,
    semver.inc(latestTag || '0.0.0', releaseType as semver.ReleaseType),
  ].join('');

  return newTag;
};

const generateReleaseNote = async (
  branch: string,
  latestTagCommitHash: string,
  masterBranch: string,
) => {
  if (isEmpty(latestTagCommitHash)) {
    return 'Initial Release';
  }

  const emptyMessage = 'Empty Changelog';
  const { commit } = await api.getBranchInfo(masterBranch);

  if (!commit.sha) {
    return emptyMessage;
  }

  const { html_url, list: commitList } = await api.getCommitList(
    commit.sha,
    latestTagCommitHash,
  );
  const list =
    branch !== masterBranch ? await api.getPullRequestList(branch) : commitList;

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
    ? emptyMessage
    : releaseContentArraryToText(changelogs) +
        releaseContentArraryToText(milestones) +
        html_url;
};

export const getTagAction = async (
  releaseType: IReleaseType,
  option: IGitTag = {},
) => {
  try {
    loading.start(`get new tag verion`);

    const { tag: prevTag, sha: prevTagSha } = await api.getLatestTag();
    const newTag = getReleaseTagName(prevTag, releaseType, option.prefix);

    loading.success();
    return {
      prevTag,
      newTag,
      prevTagSha,
    };
  } catch (e) {
    loading.fail();
    throw parseErrormsg(e);
  } finally {
    loading.stop();
  }
};

export const generateChagneLogAction = async (
  releaseBranch: string,
  latestTagCommitHash: string,
  masterBranch: string,
) => {
  try {
    loading.start(`generate the release note content`);

    const note = await generateReleaseNote(
      releaseBranch,
      latestTagCommitHash,
      masterBranch,
    );

    loading.success();
    return note;
  } catch (e) {
    loading.fail();
    throw parseErrormsg(e);
  } finally {
    loading.stop();
  }
};

export const updatePackageVersionAction = async (tagName: string) => {
  try {
    loading.start(`update the verion on package.json`);
    const result = await api.updatePackageVersion(tagName);

    loading.success();
    logging.url(result.html_url);
    return result.sha;
  } catch (e) {
    loading.fail();
    throw parseErrormsg(e);
  } finally {
    loading.stop();
  }
};

export const createReleaseAction = async (
  newTag: string,
  verionUpdateSha: string,
  note: string,
) => {
  try {
    loading.start(`create release and tag`);
    const html_url = await api.createRelease(newTag, verionUpdateSha, note);

    loading.success();
    logging.url(html_url);
  } catch (e) {
    loading.fail();
    throw parseErrormsg(e);
  } finally {
    loading.stop();
  }
};
