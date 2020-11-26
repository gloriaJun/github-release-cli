import { Octokit } from '@octokit/rest';

import { IGitRepository } from './types';

let octokit: Octokit;
let repo: IGitRepository;

export default {
  configure: (baseUrl: string, token: string, options: IGitRepository) => {
    octokit = new Octokit({
      baseUrl: baseUrl.replace(/\/$/, ''),
      auth: token,
    });

    repo = options;
  },
  listBranches: () => {
    return octokit.repos.listBranches({
      owner: repo.owner,
      repo: repo.name,
    });
  },
  getBranch: (branch: string) => {
    return octokit.repos.getBranch({
      owner: repo.owner,
      repo: repo.name,
      branch,
    });
  },
  getContent: (path: string, ref?: string) => {
    return octokit.repos.getContent({
      owner: repo.owner,
      repo: repo.name,
      path,
      ref,
    });
  },
  createOrUpdateFileContents: (
    path: string,
    message: string,
    content: string,
    sha: string,
  ) => {
    return octokit.repos.createOrUpdateFileContents({
      owner: repo.owner,
      repo: repo.name,
      path,
      message,
      content,
      sha,
    });
  },
  compareCommits: (head: string, base: string) => {
    return octokit.repos.compareCommits({
      owner: repo.owner,
      repo: repo.name,
      head,
      base,
    });
  },
  listTags: () => {
    return octokit.repos.listTags({
      owner: repo.owner,
      repo: repo.name,
    });
  },
  createRelease: (
    tagName: string,
    releaseName: string,
    target: string,
    body?: string,
  ) => {
    return octokit.repos.createRelease({
      owner: repo.owner,
      repo: repo.name,
      tag_name: tagName,
      target_commitish: target,
      name: releaseName,
      body,
    });
  },

  /**
   * pull request
   */
  createPullRequest: (
    title: string,
    headBranch: string,
    baseBranch: string,
  ) => {
    return octokit.pulls.create({
      owner: repo.owner,
      repo: repo.name,
      title,
      head: headBranch,
      base: baseBranch,
    });
  },
  mergePullRequest: (number: number) => {
    return octokit.pulls.merge({
      owner: repo.owner,
      repo: repo.name,
      pull_number: number,
      merge_method: 'merge',
    });
  },
  listPullRequests: (baseBranch: string) => {
    return octokit.pulls.list({
      owner: repo.owner,
      repo: repo.name,
      base: baseBranch,
      state: 'closed',
    });
  },
};
