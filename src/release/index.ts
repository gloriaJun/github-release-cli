import { EOL } from 'os';

import { pullRequestAction } from '../action';
import { logging } from '../utility';
import { IReleaseProcessConfig } from './interface';
import { getReleaseTagName } from './tag';

export const runReleaseProcess = async (config: IReleaseProcessConfig) =>
  //   gitFlowBranchInfo: IGitFlowBranchInfo,
  //   relBranch: string,
  {
    try {
      const { basicBranches } = config;

      const releaseBranch = await pullRequestAction(
        [basicBranches.release, basicBranches.hotfix],
        basicBranches,
      );
      if (releaseBranch) {
        logging.info(EOL);
      }

      logging.stepTitle(`Start create tag and release note ...`);
      // check the tag version for releasing
      const tagName = await getReleaseTagName(
        config.releaseType,
        config.tagPrefix,
      );

      //     const html_url = await releaseAction(gitFlowBranchInfo, relBranch);

      logging.info(`${EOL}Success release ${tagName} 🎉🎉🎉`);
      //     logging.info(`You can check the release note -> ${html_url}`);
    } catch (e) {
      logging.error(e);
    }
  };
