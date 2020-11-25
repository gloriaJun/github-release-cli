import semver from 'semver';

import { getLatestTag } from '../api';
import { inquirerContinueProcess, isNotEmpty } from '../utility';

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

export const getReleaseTagName = async (
  releaseType: semver.ReleaseType,
  tagPrefix: string,
) => {
  const latestTag = await getLatestTag();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,,@typescript-eslint/no-unsafe-call
  const newTag = [
    tagPrefix,
    semver.inc(latestTag || '0.0.0', releaseType),
  ].join('');

  await confirmCreateTag(latestTag, newTag);

  return newTag;
};
