import { pullRequestAction } from 'src/pr';
import {
  getToday,
  inquirerContinueProcess,
  isEmpty,
  isNotEmpty,
  logging,
} from 'src/utility';
import { IReleaseConfig, IReleaseType } from 'src/types';

import {
  createReleaseAction,
  getTagAction,
  generateChagneLogAction,
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

export const runReleaseProcess = async (
  releaseType: IReleaseType,
  releaseConfig: IReleaseConfig,
) => {
  try {
    const { branch: basicBranches, release } = releaseConfig;

    const { prevTag, newTag, prevTagSha } = await getTagAction(
      releaseType,
      releaseConfig.tag,
    );
    await confirmCreateTag(prevTag, newTag);

    const releaseBranch =
      (await pullRequestAction(
        [basicBranches.release, basicBranches.hotfix],
        basicBranches,
      )) || basicBranches.master;

    // crate tag and release note
    logging.stepTitle(`Start create tag and release note from`, releaseBranch);

    const title = release.title[releaseType]
      ?.replace('%tag_name%', newTag)
      .replace('%today%', getToday());
    const releaseName = isEmpty(title) ? `${newTag} (${getToday()})` : title;
    const note = await generateChagneLogAction(prevTagSha, release.labels);
    logging.preview({
      title: releaseName,
      text: note,
    });

    await inquirerContinueProcess();
    logging.newLine();

    await createReleaseAction(newTag, releaseName, note);

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
