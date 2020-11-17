import ora from 'ora';
import { Octokit } from '@octokit/rest';

import { IGitAuthConfig } from '../interface';

const spinner = ora('Loading...');

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
    spinner.start();

    const { data } = await octokit.repos.listBranches({
      owner,
      repo,
    });

    return data.reduce((result: Array<string>, { name }) => {
      result.push(name);
      return result;
    }, []);
  } finally {
    spinner.stop();
  }
};
