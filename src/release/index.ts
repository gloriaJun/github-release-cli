import { pullRequestAction } from 'src/pr';
import { inquirerContinueProcess, isNotEmpty, logging } from 'src/utility';

import { IReleaseProcessConfig } from './types';
import {
  createReleaseAction,
  getTagAction,
  generateChagneLogAction,
  updatePackageVersionAction,
} from './action';

const confirmCreateTag = async (lastestTag: string, newTag: string) => {
  await inquirerContinueProcess(
    [
      `Do you want to do the release process `,
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

    const { prevTag, newTag, prevTagSha } = await getTagAction(config);
    await confirmCreateTag(prevTag, newTag);

    const releaseBranch =
      (await pullRequestAction(
        [basicBranches.release, basicBranches.hotfix],
        basicBranches,
      )) || basicBranches.master;

    // crate tag and release note
    logging.stepTitle(`Start create tag and release note from`, releaseBranch);

    const note = await generateChagneLogAction(
      releaseBranch,
      prevTagSha,
      config,
    );
    logging.preview({ text: note });

    await inquirerContinueProcess();
    logging.newLine();

    const verionUpdateSha = await updatePackageVersionAction(newTag);
    await createReleaseAction(newTag, verionUpdateSha, note);

    logging.newLine();
    logging.success(
      `🎉🎉🎉 Success release ${newTag} from ${releaseBranch} 🎉🎉🎉`,
    );
    logging.newLine();
  } catch (error) {
    logging.newLine();
    logging.error(error);
  }
};
