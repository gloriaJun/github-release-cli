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
  number: number;
  title: string;
  sha: string;
  milestoneHtmlUrl?: string; // html url about milestone
}

export interface IGitCommit {
  title: string;
  sha: string;
}
