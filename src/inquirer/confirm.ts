import pad from 'pad';
import colors from 'colors';

import { IReleaseConfig } from '../interface';
import { inquirerConfirmQuestion } from './shared';

const paddingSize = 20;

const log = (name: string, value: string) => {
  console.log(pad(`${name}: `, paddingSize), colors.green(value));
};

export const askConfigConfirm = async ({
  relBranch,
  tagName,
  targetPrBranchInfo,
}: IReleaseConfig) => {
  console.log('\n\n======================================');
  console.log('Your Configuration');
  console.log('======================================');

  log('Release Branch', relBranch);
  log('Tag Name', tagName);

  console.log('\nCreate Pull Request & Merge Option');
  Object.keys(targetPrBranchInfo)
    .filter((k) => !['relBranch', 'tagName'].includes(k))
    .map((k) => {
      const isYN = (v: boolean) => (v ? colors.green('Y') : colors.grey('N'));
      const obj = targetPrBranchInfo[k];

      console.log(
        pad(`  - ${k}`, paddingSize),
        `PR(${isYN(obj.isCreate)}), Merge(${isYN(obj.isMerge)})`,
      );
    });

  console.log('\n');

  return await inquirerConfirmQuestion(
    {
      message: `Do you want to continue?`,
      default: true,
    },
    'isContinue',
  );
};
