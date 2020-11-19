import dotenv from 'dotenv';

import { getBaseApiUrl, getRepoName, getRepoOwner, getToken } from './inquirer';
import { setGitApiService } from './action';
import {
  isNotEmpty,
  parseEnvConfigByKey,
  parseEnvConfigString,
} from './utility';
import { IGitFlowBranchInfo } from './interface';

const defaultBranchInfo: IGitFlowBranchInfo = {
  master: 'main',
  develop: 'develop',
  release: 'release/',
  hotfix: 'hotfix/',
};

const setBranchPrefix = (info: IGitFlowBranchInfo) => {
  const keys = Object.keys(info) as Array<keyof IGitFlowBranchInfo>;

  return keys.reduce((result, key: keyof IGitFlowBranchInfo) => {
    if (isNotEmpty(info[key])) {
      result[key] = info[key];
    }
    return result;
  }, defaultBranchInfo);
};

export const setConfiguration = async (
  path: string,
): Promise<IGitFlowBranchInfo> => {
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

  const branchInfo = setBranchPrefix({
    master: parseEnvConfigString('MASTER'),
    develop: parseEnvConfigString('DEVELOP'),
    release: parseEnvConfigString('RELEASE'),
    hotfix: parseEnvConfigString('HOTFIX'),
  });

  return branchInfo;
};
