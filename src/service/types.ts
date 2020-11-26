export interface IGitRepository {
  owner: string;
  name: string;
}

export interface IGitFlowBranch {
  master: string;
  develop: string;
  release: string;
  hotfix: string;
}
export interface IGitPullRequest {
  title: string;
  sha: string;
  prNumber?: number;
  milestoneHtmlUrl?: string; // html url about milestone
}
