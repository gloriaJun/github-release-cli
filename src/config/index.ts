import * as jsYaml from 'js-yaml';
import fs from 'fs';

import { isEmpty } from 'src/utility';
import { defaultBranchTypeModel, IReleaseConfig } from 'src/types';

import { getBaseApiUrl, getRepoName, getRepoOwner, getToken } from './auth';

let config: IReleaseConfig;

const loadConfig = (path: string) => {
  const fileContents = fs.readFileSync(path, 'utf8');
  return jsYaml.safeLoad(fileContents) as IReleaseConfig;
};

export const loadReleaseConfig = async (path: string) => {
  const config = loadConfig(path);

  if (isEmpty(config.baseUrl)) {
    config.baseUrl = await getBaseApiUrl();
  }

  if (isEmpty(config.token)) {
    config.token = await getToken();
  }

  if (isEmpty(config.repo.owner)) {
    config.repo.owner = await getRepoOwner();
  }

  if (isEmpty(config.repo.name)) {
    config.repo.name = await getRepoName();
  }

  config.branch = Object.assign(defaultBranchTypeModel, config.branch);

  return config;
};

export default {
  set: async (path: string) => {
    config = loadConfig(path);

    if (isEmpty(config.baseUrl)) {
      config.baseUrl = await getBaseApiUrl();
    }

    if (isEmpty(config.token)) {
      config.token = await getToken();
    }

    if (isEmpty(config.repo.owner)) {
      config.repo.owner = await getRepoOwner();
    }

    if (isEmpty(config.repo.name)) {
      config.repo.name = await getRepoName();
    }

    config.branch = Object.assign(defaultBranchTypeModel, config.branch);
  },

  get: () => {
    return config;
  },
};
