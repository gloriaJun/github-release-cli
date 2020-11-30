import { IGeneralObject } from '../interface';

export interface IBranchPrInfo {
  isCreate: boolean;
  isMerge: boolean;
}

export interface IPullRequestConfig {
  relBranch: string;
  targetPrBranchInfo: IGeneralObject<IBranchPrInfo>;
}
