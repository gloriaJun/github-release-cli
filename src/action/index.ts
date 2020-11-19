import { Octokit } from '@octokit/rest';

import { IGitAuthConfig } from '../interface';
import loading from '../utility/loading';

let octokit: Octokit;
let owner: string;
let repo: string;

export const setGitApiService = ({
  baseUrl,
  token,
  ...info
}: IGitAuthConfig) => {
  octokit = new Octokit({
    baseUrl,
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
