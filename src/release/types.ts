import semver from 'semver';

import { IGitFlowBranch } from '../service';

export interface IReleaseProcessConfig {
  releaseType: semver.ReleaseType;
  basicBranches: IGitFlowBranch;
  tagPrefix: string;
}
