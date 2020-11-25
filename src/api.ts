import { Octokit } from '@octokit/rest';

import { IGitAuthConfig, IReleaseConfig } from './interface';
import { loading, logging } from './utility';

let octokit: Octokit;
let owner: string;
let repo: string;

export const setGitApiService = ({
  baseUrl,
  token,
  ...info
}: IGitAuthConfig) => {
  octokit = new Octokit({
    baseUrl: baseUrl.replace(/\/$/, ''),
    auth: token,
  });

  owner = info.owner;
  repo = info.repo;
};

export const getBranchList = async () => {
  try {
    loading.start('get branch list');
    const { data } = await octokit.repos.listBranches({
      owner,
      repo,
    });
    return data.reduce((result: Array<string>, { name }) => {
      result.push(name);
      return result;
    }, []);
  } finally {
    loading.stop();
  }
};

export const createPullRequest = async (
  title: string,
  head: string,
  base: string,
) => {
  try {
    loading.start(`create pull reqquest to ${base} branch`);

    const { data } = await octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
    });

    return data;
  } finally {
    loading.stop();
  }
};

export const mergePullRequest = async (number: number, base: string) => {
  try {
    loading.start(`merge pull reqquest to ${base} branch`);

    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: number,
      merge_method: 'merge',
    });
  } finally {
    loading.stop();
  }
};

export const getPullRequestList = async (base: string) => {
  try {
    loading.start(`generate release content`);

    const { data } = await octokit.pulls.list({
      owner,
      repo,
      base,
      state: 'closed',
    });

    return data;
  } finally {
    loading.stop();
    logging.success('generated the release note content');
  }
};

export const getMainBranch = async (branch: string) => {
  const { data } = await octokit.repos.getBranch({
    owner,
    repo,
    branch,
  });

  return data.commit.sha;
};

export const getLatestTag = async () => {
  const { data } = await octokit.repos.listTags({
    owner,
    repo,
  });

  return data[0]?.name;
};

export const createTag = async (tag: string, sha: string, message?: string) => {
  const { data } = await octokit.git.createTag({
    owner,
    repo,
    tag,
    message: message || `create the tag ${tag}`,
    object: sha,
    type: 'commit',
  });

  return data;
};

export const createRelease = async ({
  tagName,
  releaseName,
  targetCommitish,
}: IReleaseConfig) => {
  try {
    loading.start(`create a new release`);

    const { data } = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      target_commitish: targetCommitish,
      name: releaseName,
    });

    return data;
  } finally {
    loading.stop();
  }
};
