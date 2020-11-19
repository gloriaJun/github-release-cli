import { IBranchInfo } from '../interface';
import { inquirerRequiredQuestion } from './shared';

const getTagName = async (name: string) => {
  const key = 'tagName';

  return await inquirerRequiredQuestion(
    {
      type: 'input',
      name: key,
      message: 'Input tag name',
      default: name,
    },
    key,
  );
};

export const askReleaseProcess = async (
  basicBranchInfo: IBranchInfo,
  relBranch: string,
): Promise<string> => {
  const prefix = basicBranchInfo.release;
  return await getTagName(relBranch.replace(prefix, ''));
};
