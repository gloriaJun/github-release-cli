import dotenv from 'dotenv';

import {
  askReleaseProcess,
  getBaseApiUrl,
  getRepoName,
  getRepoOwner,
  getToken,
  setBranchPrefix,
} from './inquirer';
import { setGitApiService } from './action';
import { parseEnvConfigByKey, parseEnvConfigString } from './utility';

export const setConfiguration = async (path: string) => {
  dotenv.config({ path });

  const gitConfig = {
    baseUrl: await parseEnvConfigByKey('BASE_URL', getBaseApiUrl),
    token: await parseEnvConfigByKey('TOKEN', getToken),
    owner: await parseEnvConfigByKey('REPO_OWNER', getRepoOwner),
    repo: await parseEnvConfigByKey('REPO_NAME', getRepoName),
  };

  console.log('------------------');
  console.log(gitConfig);
  console.log('------------------');

  setGitApiService(gitConfig);
  setBranchPrefix({
    master: parseEnvConfigString('MASTER'),
    develop: parseEnvConfigString('DEVELOP'),
    release: parseEnvConfigString('RELEASE'),
    hotfix: parseEnvConfigString('HOTFIX'),
  });

  return await askReleaseProcess();
};
