import ora from 'ora';
// import { Octokit } from '@octokit/rest';

// const octokit = new Octokit({
//   auth: token || null,
//   baseUrl: program.baseurl,
// });

const spinner = ora('Loading...');

export const getBranchList = () => {
  try {
    spinner.start();

    console.log('display the repo list');
  } finally {
    spinner.stop();
  }
};
