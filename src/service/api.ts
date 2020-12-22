import { EOL } from 'os';

import { fromBase64, toBase64 } from 'src/utility';
import {
  IBranchType,
  IGitCreateRelease,
  IGitPullRequest,
  IReleaseConfig,
} from 'src/types';

import git from './git-service';

let gitFlowBranch: IBranchType;

export default {
  setConfiguration: (releaseConfig: IReleaseConfig) => {
    gitFlowBranch = releaseConfig.branch;
    git.configure(
      releaseConfig.baseUrl,
      releaseConfig.token,
      releaseConfig.repo,
    );
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
    const item = data[0] || {};

    return {
      tag: item.name,
      sha: item.commit?.sha,
    };
  },

  getCommitList: async (head: string, base: string) => {
    const {
      data: { html_url, commits },
    } = await git.compareCommits(head, base);

    const list = commits.reduce(
      (result: Array<IGitPullRequest>, { commit, sha }) => {
        if (sha) {
          result.push({
            // title: commit.message.replace(new RegExp(EOL + EOL, 'g'), EOL),
            title: commit.message.split(EOL)[0],
            sha,
          });
        }
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

    const { sha, content } = await git.getFileContent(
      path,
      gitFlowBranch.master,
    );

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

  createRelease: async (param: IGitCreateRelease) => {
    const { data } = await git.createRelease(param);
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
        const result = await git.mergePullRequest(number);
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

  /*
https://docs.github.com/en/free-pro-team@latest/rest/reference/pulls#get-a-pull-request
*/
  getPullRequest: async (number: number) => {
    const { data } = await git.getPullRequest(number);

    return data;
  },

  getPullRequestList: async (baseBranch: string) => {
    const { data } = await git.listPullRequests(baseBranch);

    const list = data.reduce(
      (
        result: Array<IGitPullRequest>,
        { title, number, merge_commit_sha, milestone },
      ) => {
        if (merge_commit_sha) {
          result.push({
            title,
            prNumber: number,
            sha: merge_commit_sha,
            milestoneHtmlUrl: milestone?.html_url,
          });
        }
        return result;
      },
      [],
    );

    return list;
  },
};
