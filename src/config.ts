import dotenv from 'dotenv';

import { getBaseApiUrl, getRepoName, getRepoOwner, getToken } from './inquirer';
import { api } from './service';
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

  const baseUrl = await parseEnvConfigByKey('BASE_URL', getBaseApiUrl);
  const token = await parseEnvConfigByKey('TOKEN', getToken);
  const owner = await parseEnvConfigByKey('REPO_OWNER', getRepoOwner);
  const name = await parseEnvConfigByKey('REPO_NAME', getRepoName);

  const basicBranches = setBranchPrefix({
    master: parseEnvConfigString('MASTER'),
    develop: parseEnvConfigString('DEVELOP'),
    release: parseEnvConfigString('RELEASE'),
    hotfix: parseEnvConfigString('HOTFIX'),
  });

  api.setConfiguration(baseUrl, token, { owner, name }, basicBranches);

  return {
    basicBranches,
    tagPrefix: parseEnvConfigString('TAG_PREFIX'),
  };
};
