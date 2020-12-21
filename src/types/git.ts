export interface IGitRepository {
  owner: string;
  name: string;
}

export interface IGitFlowBranch {
  master: 'master' | 'main';
  develop: 'develop';
  release: 'release/' | string;
  hotfix: 'hotfix/' | string;
}

export const gitFlowBranchDefaultModel: IGitFlowBranch = {
  master: 'main',
  develop: 'develop',
  release: 'release/',
  hotfix: 'hotfix/',
} as const;

export interface IGitPullRequest {
  title: string;
  sha: string;
  prNumber?: number;
  milestoneHtmlUrl?: string; // html url about milestone
}
