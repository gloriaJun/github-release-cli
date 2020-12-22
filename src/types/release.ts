export interface IBranchType {
  master: 'master' | 'main';
  develop: 'develop';
  release: 'release/' | string;
  hotfix: 'hotfix/' | string;
}

export const defaultBranchTypeModel: IBranchType = {
  master: 'main',
  develop: 'develop',
  release: 'release/',
  hotfix: 'hotfix/',
} as const;

export interface ITag {
  prefix?: string;
}

export const releaseTypes = ['major', 'minor', 'patch'] as const;
export type IReleaseType = typeof releaseTypes[number];

export interface IReleaseNote {
  title: {
    [k in IReleaseType]: string;
  };
}
