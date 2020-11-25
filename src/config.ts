import dotenv from 'dotenv';

import { getBaseApiUrl, getRepoName, getRepoOwner, getToken } from './inquirer';
import { setGitApiService } from './api';
import {
  isNotEmpty,
  parseEnvConfigByKey,
  parseEnvConfigString,
} from './utility';
import { IGitFlowBranchInfo } from './interface';
import { defaultBasicBranches } from './constants';

const setBranchPrefix = (info: IGitFlowBranchInfo) => {
  const keys = Object.keys(info) as Array<keyof IGitFlowBranchInfo>;

  return keys.reduce((result, key: keyof IGitFlowBranchInfo) => {
    if (isNotEmpty(info[key])) {
      result[key] = info[key];
    }
    return result;
  }, defaultBasicBranches);
};

export const setConfiguration = async (path: string) => {
  dotenv.config({ path });

  setGitApiService({
    baseUrl: await parseEnvConfigByKey('BASE_URL', getBaseApiUrl),
    token: await parseEnvConfigByKey('TOKEN', getToken),
    owner: await parseEnvConfigByKey('REPO_OWNER', getRepoOwner),
    repo: await parseEnvConfigByKey('REPO_NAME', getRepoName),
  });

  const basicBranches = setBranchPrefix({
    master: parseEnvConfigString('MASTER'),
    develop: parseEnvConfigString('DEVELOP'),
    release: parseEnvConfigString('RELEASE'),
    hotfix: parseEnvConfigString('HOTFIX'),
  });

  return {
    basicBranches,
  };
};
