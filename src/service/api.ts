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

const getPullRequest = async (number?: number) => {
  if (!number) {
    return {};
  }

  const {
    data: { labels, milestone },
  } = await git.getPullRequest(number);

  const labelList = labels.reduce((result: Array<string>, item) => {
    if (item && item.name) {
      result.push(item.name);
    }
    return result;
  }, []);

  return {
    labels: labelList,
    milestoneHtmlUrl: milestone?.html_url,
  };
};

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

  getLastBranchCommitSha: async (branch?: string) => {
    const branchName = branch || gitFlowBranch.master;
    const {
      data: { commit },
    } = await git.getBranch(branchName);

    if (!commit.sha) {
      throw `Can not get the commit sha from ${branchName} `;
    }

    return commit.sha;
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

    const list = await commits.reduce(
      async (promise: Promise<Array<IGitPullRequest>>, { commit, sha }) => {
        const result = await promise.then();

        const ignoreLogPatternRegExp = new RegExp(
          '((^Merge branch)|(^Merge pull request)|(update release version))\\s',
        );
        const title = commit.message.split(EOL)[0];

        if (sha && !ignoreLogPatternRegExp.test(title)) {
          const prNumber = Number.parseInt(
            new RegExp('\\s\\(#(\\d{1,})\\)', 'g').exec(title)?.[1] || '',
          );
          const prInfo = await getPullRequest(prNumber);

          result.push({
            title,
            sha,
            prNumber,
            ...prInfo,
          });
        }

        return Promise.resolve(result);
      },
      Promise.resolve([]),
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
