import { components } from '@octokit/openapi-types';

export interface IGitRepository {
  owner: string;
  name: string;
}

export interface IGitPullRequest {
  title: string;
  sha: string;
  prNumber?: number;
  milestoneHtmlUrl?: string; // html url about milestone
}

export interface IGitCreateRelease {
  tagName: string;
  releaseName: string;
  target: string;
  body?: string;
}

export type GetRepoContentResponseDataFile = components['schemas']['content-file'];
