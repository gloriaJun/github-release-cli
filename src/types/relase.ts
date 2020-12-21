import { IGitFlowBranch, IGitRepository } from './git';

export interface IReleaseConfig {
  baseUrl: string;
  token: string;
  repo: IGitRepository;
  branch: IGitFlowBranch;
  tag?: {
    prefix?: string;
  };
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
