import { EOL } from 'os';

import { pullRequestAction } from '../action';
import { logging } from '../utility';
import { IReleaseProcessConfig } from './interface';
import { createReleaseAction } from './action';

export const runReleaseProcess = async (config: IReleaseProcessConfig) => {
  try {
    const { basicBranches } = config;

    let releaseBranch = await pullRequestAction(
      [basicBranches.release, basicBranches.hotfix],
      basicBranches,
    );
    if (releaseBranch) {
      logging.info(EOL);
    } else {
      releaseBranch = basicBranches.master;
    }

    // crate tag and release note
    await createReleaseAction(releaseBranch, config);
  } catch (e) {
    logging.error(e);
  }
};
