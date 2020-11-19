import pad from 'pad';
import colors from 'colors';

import { IPullRequestConfig } from '../interface';
import { inquirerConfirmQuestion } from './shared';

const paddingSize = 20;

const log = (name: string, value: string) => {
  console.log(pad(`${name}: `, paddingSize), colors.green(value));
};

export const askPullRequestConfigConfirm = async ({
  relBranch,
  targetPrBranchInfo,
}: IPullRequestConfig) => {
  console.log('\n\n======================================');
  console.log('Pull Request & Merge Configuration');
  console.log('======================================');

  log('Release Branch', relBranch);
  // log('Tag Name', tagName);

  console.log('\nTarget Branch List');
  Object.keys(targetPrBranchInfo)
    // .filter((k) => !['relBranch', 'tagName'].includes(k))
    .map((k) => {
      const isYN = (v: boolean) => (v ? colors.green('Y') : colors.grey('N'));
      const obj = targetPrBranchInfo[k];

      console.log(
        pad(`  - ${k}`, paddingSize),
        `PR(${isYN(obj.isCreate)}), Merge(${isYN(obj.isMerge)})`,
      );
    });

  console.log('\n');

  return await inquirerConfirmQuestion({ default: true });
};