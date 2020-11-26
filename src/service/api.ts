import { EOL } from 'os';

import { fromBase64, getToday, toBase64 } from '../utility';
import git from './git-service';
import {
  IGitCommit,
  IGitFlowBranch,
  IGitPullRequest,
  IGitRepository,
} from './types';

let gitFlowBranch: IGitFlowBranch;

export default {
  setConfiguration: (
    baseUrl: string,
    token: string,
    options: IGitRepository,
    branches: IGitFlowBranch,
  ) => {
    gitFlowBranch = branches;
    git.configure(baseUrl, token, options);
  },

  getBranchList: async () => {
    const { data } = await git.listBranches();

    const list = data.reduce((result: Array<string>, { name }) => {
      result.push(name);
      return result;
    }, []);

    return list;
  },

  getBranchInfo: async (branch: string) => {
    const { data } = await git.getBranch(branch);
    return data;
  },

  getLatestTag: async () => {
    const { data } = await git.listTags();
    const item = data[0];

    return {
      tag: item.name,
      sha: item.commit.sha,
    };
  },

  getCommitList: async (head: string, base: string) => {
    const {
      data: { html_url, commits },
    } = await git.compareCommits(head, base);

    const list = commits.reduce(
      (result: Array<IGitCommit>, { commit, sha }) => {
        console.log('### commit message', commit.message);
        result.push({
          title: commit.message.replace(new RegExp(EOL + EOL, 'g'), EOL),
          sha,
        });
        return result;
      },
      [],
    );

    return {
      html_url,
      list,
    };
  },

  updatePackageVersion: async (newVersion: string) => {
    const path = 'package.json';
    const getVersion = (ver: string) => {
      const matched = new RegExp('(\\d+\\.){2}.+').exec(ver);
      return matched ? matched[0] : '';
    };

    const {
      data: { sha, content },
    } = await git.getContent(path, gitFlowBranch.master);

    const regexp = new RegExp('("version":\\s+)"((\\d\\.){2}\\d)"');
    const newScript = fromBase64(content).replace(
      regexp,
      `$1"${getVersion(newVersion)}"`,
    );

    const {
      data: { commit },
    } = await git.createOrUpdateFileContents(
      path,
      `chore: update release version ${newVersion}`,
      toBase64(newScript),
      sha,
    );

    return commit;
  },

  createRelease: async (tagName: string, target: string, body?: string) => {
    const { data } = await git.createRelease(
      tagName,
      `${tagName} (${getToday()})`,
      target,
      body,
    );

    return data.html_url;
  },

  createReleasePullRequest: async (
    releaseBranch: string,
    baseBranch: string,
    isAllowMerge: boolean,
  ) => {
    const {
      data: { html_url, number },
    } = await git.createPullRequest(
      `merge ${releaseBranch} to ${baseBranch}`,
      releaseBranch,
      baseBranch,
    );
    let isMerged = isAllowMerge;

    if (isAllowMerge) {
      try {
        const result = git.mergePullRequest(number);
        console.log('### merge result', result);
      } catch (e) {
        isMerged = false;
        console.log('merge failed --> ', e);
      }
    }

    return {
      isMerged,
      html_url,
    };
  },

  getPullRequestList: async (baseBranch: string) => {
    const { data } = await git.listPullRequests(baseBranch);

    const list = data.reduce(
      (
        result: Array<IGitPullRequest>,
        { title, number, merge_commit_sha, milestone },
      ) => {
        result.push({
          title,
          number,
          sha: merge_commit_sha,
          milestoneHtmlUrl: milestone?.html_url,
        });
        return result;
      },
      [],
    );

    return list;
  },
};
