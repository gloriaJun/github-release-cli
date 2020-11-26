import semver from 'semver';
import { IGitFlowBranchInfo } from '../interface';

export interface IReleaseProcessConfig {
  releaseType: semver.ReleaseType;
  basicBranches: IGitFlowBranchInfo;
  tagPrefix: string;
}
