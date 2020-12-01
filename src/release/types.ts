import semver from 'semver';

import { IGitFlowBranch } from 'src/service';

export interface IReleaseProcessConfig {
  releaseType: semver.ReleaseType;
  basicBranches: IGitFlowBranch;
  tagPrefix: string;
}
