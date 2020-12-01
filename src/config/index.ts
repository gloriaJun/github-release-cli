import dotenv from 'dotenv';

import {
  isNotEmpty,
  parseEnvConfigByKey,
  parseEnvConfigString,
} from 'src/utility';
import { api, IGitFlowBranch } from 'src/service';
import { defaultBasicBranches } from 'src/constants';
import { getBaseApiUrl, getRepoName, getRepoOwner, getToken } from './auth';

const setBranchPrefix = (info: IGitFlowBranch) => {
  const keys = Object.keys(info) as Array<keyof IGitFlowBranch>;

  return keys.reduce((result, key: keyof IGitFlowBranch) => {
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
