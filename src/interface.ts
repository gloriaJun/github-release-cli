export interface IGeneralObject<T> {
  [index: string]: T;
}
export interface IBranchPrInfo {
  isCreate: boolean;
  isMerge: boolean;
}

export interface IBranchInfo {
  master: string;
  develop: string;
  release: string;
  hotfix: string;
}

export interface IGitAuthConfig {
  baseUrl: string;
  token: string;
  owner: string;
  repo: string;
}

export interface IReleaseConfig {
  relBranch: string;
  tagName: string;
  targetPrBranchInfo: IGeneralObject<IBranchPrInfo>;
}
