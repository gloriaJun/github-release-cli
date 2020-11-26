import { pullRequestAction } from '../action';
import { logging } from '../utility';
import { IReleaseProcessConfig } from './types';
import { createReleaseAction } from './action';

export const runReleaseProcess = async (config: IReleaseProcessConfig) => {
  try {
    const { basicBranches } = config;

    const releaseBranch = await pullRequestAction(
      [basicBranches.release, basicBranches.hotfix],
      basicBranches,
    );

    // crate tag and release note
    await createReleaseAction(releaseBranch || basicBranches.master, config);
  } catch (e) {
    logging.error(e);
  }
};
