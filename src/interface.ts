export interface IGeneralObject<T> {
  [index: string]: T;
}
export interface IBranchPrInfo {
  isCreate: boolean;
  isMerge: boolean;
}
export interface IGitFlowBranchInfo {
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

export interface IPullRequestConfig {
  relBranch: string;
  targetPrBranchInfo: IGeneralObject<IBranchPrInfo>;
}
export interface IReleaseConfig {
  isCreateRelease?: boolean;
  tagName: string;
  releaseName: string;
  targetCommitish: string;
  body?: string;
}
