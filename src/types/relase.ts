import { IGitFlowBranch, IGitRepository, IGitTag } from './git';

export interface IReleaseConfig {
  baseUrl: string;
  token: string;
  repo: IGitRepository;
  branch: IGitFlowBranch;
  tag?: IGitTag;
  release: {
    title: {
      major: string;
      minor: string;
      patch: string;
    };
  };
}

export const releaseTypes = ['major', 'minor', 'patch'] as const;
export type IReleaseType = typeof releaseTypes[number];
