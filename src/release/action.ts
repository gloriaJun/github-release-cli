import { EOL } from 'os';
import * as semver from 'semver';
import { RequestError } from '@octokit/types';

import { api } from 'src/service';
import { isEmpty, loading, logging } from 'src/utility';
import { ITag, IReleaseType, IGitPullRequest } from 'src/types';

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

const generateReleaseNote = (
  logs: IGitPullRequest[],
  category: string[] = [],
  compareUrl: string,
) => {
  const EtcCategoryTitle = 'Etc';
  const milestones = [] as string[];
  const changelogs = new Map<string, string[]>();

  logs.map(({ title, sha, labels = [], milestoneHtmlUrl }) => {
    const label: string =
      labels.filter((v) => category.includes(v))?.[0] || EtcCategoryTitle;
    const log = `* ${title} ` + `${sha ? sha.substr(0, 7) : ''}`;

    if (changelogs.has(label)) {
      const item = changelogs.get(label) || [];
      item.push(log);
    } else {
      changelogs.set(label, [log]);
    }

    if (milestoneHtmlUrl && !milestones.includes(milestoneHtmlUrl)) {
      milestones.push(milestoneHtmlUrl);
    }
  });

  const releaseContentArraryToText = (title: string, contents: string[]) => {
    return contents.length > 0
      ? `${title}${EOL}${EOL}` + `${contents.join(EOL)}${EOL}${EOL}${EOL}`
      : '';
  };

  const len = category.length;
  const note =
    len > 0
      ? [...category, EtcCategoryTitle].reduce(
          (result: string[], item, idx) => {
            const contents = changelogs.get(item);

            if (!contents) {
              return result;
            }

            if (idx < len) {
              contents.push('');
            }

            return [...result, `##### ${item}`, ...contents];
          },
          [],
        )
      : changelogs.get(EtcCategoryTitle) || [];

  return (
    releaseContentArraryToText('#### Changelog', note) +
    releaseContentArraryToText('#### Milestone', milestones) +
    compareUrl
  );
};

const updatePackageVersionAction = async (tagName: string) => {
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

export const getTagAction = async (
  releaseType: IReleaseType,
  option: ITag = {},
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
  latestTagCommitHash: string,
  category?: string[],
) => {
  try {
    loading.start(`generate the release note content`);

    if (isEmpty(latestTagCommitHash)) {
      loading.success();
      return 'Initial Release';
    }

    const latestBranchCommitHash = await api.getLastBranchCommitSha();
    const { html_url, list } = await api.getCommitList(
      latestBranchCommitHash,
      latestTagCommitHash,
    );

    if (list.length === 0) {
      loading.success();
      return 'Empty Changelog';
    }

    const note = generateReleaseNote(list, category, html_url);

    loading.success();
    return note;
  } catch (e) {
    loading.fail();
    throw parseErrormsg(e);
  } finally {
    loading.stop();
  }
};

export const createReleaseAction = async (
  tagName: string,
  releaseName: string,
  note: string,
) => {
  const verionUpdateSha = await updatePackageVersionAction(tagName);

  try {
    loading.start(`create release and tag`);

    const html_url = await api.createRelease({
      tagName,
      releaseName,
      target: verionUpdateSha,
      body: note,
    });

    loading.success();
    logging.url(html_url);
  } catch (e) {
    loading.fail();
    throw parseErrormsg(e);
  } finally {
    loading.stop();
  }
};
