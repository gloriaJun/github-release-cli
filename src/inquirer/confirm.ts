import pad from 'pad';
import colors from 'colors';

import { IPullRequestConfig } from '../interface';
import { inquirerConfirmQuestion } from './shared';
import { logging } from '../utility';

const paddingSize = 20;

const log = (name: string, value: string) => {
  console.log(pad(`${name}: `, paddingSize), colors.green(value));
};

export const askPullRequestConfigConfirm = async ({
  relBranch,
  targetPrBranchInfo,
}: IPullRequestConfig) => {
  logging.info('\n======================================');
  logging.info('Pull Request & Merge Configuration');
  logging.info('======================================');

  log('Release Branch', relBranch);

  logging.info('\nTarget Branch List');
  Object.keys(targetPrBranchInfo).map((k) => {
    const isYN = (v: boolean) => (v ? colors.green('Y') : colors.grey('N'));
    const obj = targetPrBranchInfo[k];

    logging.infoKeyValue(
      `  - ${k}`,
      `PR(${isYN(obj.isCreate)}), Merge(${isYN(obj.isMerge)})`,
    );
  });

  return await inquirerConfirmQuestion({ default: true });
};
