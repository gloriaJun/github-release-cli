import chalk from 'chalk';

import { IPullRequestConfig } from '../interface';
import { inquirerContinueProcess } from '../utility';
import { logging } from '../utility';

export const askPullRequestConfigConfirm = async ({
  relBranch,
  targetPrBranchInfo,
}: IPullRequestConfig) => {
  logging.info('\n======================================');
  logging.info('Pull Request & Merge Configuration');
  logging.info('======================================');

  logging.infoKeyValue('Release Branch', relBranch);

  logging.info('\nTarget Branch List');
  Object.keys(targetPrBranchInfo).map((k) => {
    const isYN = (v: boolean) => (v ? chalk.green('Y') : chalk.grey('N'));
    const obj = targetPrBranchInfo[k];

    if (obj.isCreate) {
      logging.infoKeyValue(
        `  - ${k}`,
        `PR(${isYN(obj.isCreate)}), Merge(${isYN(obj.isMerge)})`,
      );
    }
  });

  await inquirerContinueProcess();
};
