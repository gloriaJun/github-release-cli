import { IGitFlowBranchInfo } from './interface';

export const pkgVersions = Object.freeze({
  major: 'major',
  minor: 'minor',
  patch: 'patch',
});

export const defaultBasicBranches: IGitFlowBranchInfo = {
  master: 'main',
  develop: 'develop',
  release: 'release/',
  hotfix: 'hotfix/',
};
