import { IGitFlowBranch } from './service';

export const pkgVersions = Object.freeze({
  major: 'major',
  minor: 'minor',
  patch: 'patch',
});

export const defaultBasicBranches: IGitFlowBranch = {
  master: 'main',
  develop: 'develop',
  release: 'release/',
  hotfix: 'hotfix/',
};
