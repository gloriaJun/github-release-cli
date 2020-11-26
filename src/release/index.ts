import { pullRequestAction } from '../action';
import { inquirerContinueProcess, isNotEmpty, logging } from '../utility';
import { IReleaseProcessConfig } from './types';
import {
  createReleaseAction,
  prepareReleaseAction,
  updatePackageVersionAction,
} from './action';

const confirmCreateTag = async (lastestTag: string, newTag: string) => {
  await inquirerContinueProcess(
    [
      `Do you want to create the tag `,
      '(',
      isNotEmpty(lastestTag) ? `${lastestTag} -> ` : '',
      newTag,
      ')',
      ' ?',
    ].join(''),
  );
};

export const runReleaseProcess = async (config: IReleaseProcessConfig) => {
  try {
    const { basicBranches } = config;

    const releaseBranch =
      (await pullRequestAction(
        [basicBranches.release, basicBranches.hotfix],
        basicBranches,
      )) || basicBranches.master;

    // crate tag and release note
    // await createTagAndRelease(releaseBranch, config);
    logging.stepTitle(`Start create tag and release note from`, releaseBranch);

    const { prevTag, newTag, note } = await prepareReleaseAction(
      releaseBranch,
      config,
    );
    logging.preview({ text: note });

    await confirmCreateTag(prevTag, newTag);
    logging.newLine();

    const verionUpdateSha = await updatePackageVersionAction(newTag);
    await createReleaseAction(newTag, verionUpdateSha, note);

    logging.newLine();
    logging.success(
      `🎉🎉🎉 Success release ${newTag} from ${releaseBranch} 🎉🎉🎉`,
    );
    logging.newLine();
  } catch (e) {
    logging.error(e);
  }
};
