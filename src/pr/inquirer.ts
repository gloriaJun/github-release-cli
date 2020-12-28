import inquirer from 'inquirer';
import chalk from 'chalk';

import { api } from 'src/service';
import { IGeneralObject } from 'src/interface';
import {
  inquirerConfirmQuestion,
  inquirerContinueProcess,
  logging,
} from 'src/utility';
import { IBranchType } from 'src/types';

import { IBranchPrInfo, IPullRequestConfig } from './types';

const getReleaseBranch = async (list: Array<string>) => {
  if (!list || list.length === 0) {
    throw `The selectable branch list is empty ... ✋`;
  }

  const { branch } = (await inquirer.prompt([
    {
      type: 'list',
      name: 'branch',
      message: 'Choose the target branch',
      choices: list,
    },
  ])) as inquirer.Answers;

  return branch as string;
};

const getTargetBranchList = (
  basicBranchInfo: IBranchType,
  list: Array<string>,
) => {
  const targetBranchList: string[] = [basicBranchInfo.master];

  if (list.includes(basicBranchInfo.develop)) {
    targetBranchList.push(basicBranchInfo.develop);
  }

  list
    .filter((v) => !targetBranchList.includes(v))
    .map((v) => {
      targetBranchList.push(v);
    });

  return targetBranchList;
};

const checkPullRequestToOtherBranch = async (
  basicBranchInfo: IBranchType,
  list: Array<string>,
) => {
  const targetBranchList = getTargetBranchList(basicBranchInfo, list);

  const targetBranchAnswer = await targetBranchList.reduce(
    async (promise: Promise<IGeneralObject<IBranchPrInfo>>, branch: string) => {
      const result = await promise.then();
      const defaultValue = basicBranchInfo.master === branch;

      const isCreate = await inquirerConfirmQuestion({
        message: `Create PR to '${branch}' branch`,
        default: defaultValue,
      });

      const isMerge =
        isCreate &&
        (await inquirerConfirmQuestion({
          message: `Merge PR to '${branch}' branch`,
          default: defaultValue || isCreate,
        }));

      result[branch] = {
        isCreate,
        isMerge,
      };

      return Promise.resolve(result);
    },
    Promise.resolve({}),
  );

  return targetBranchAnswer;
};

const askPullRequestConfigConfirm = async ({
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

export const askPullRequestProcess = async (
  prefixList: string[],
  gitFlowBranchInfo: IBranchType,
): Promise<IPullRequestConfig> => {
  const branchList = await api.getBranchList();

  const releaseBranchList = prefixList.reduce((result: string[], prefix) => {
    return result.concat(branchList.filter((v) => new RegExp(prefix).test(v)));
  }, []);

  const relBranch = await getReleaseBranch(releaseBranchList);
  const targetPrBranchInfo = await checkPullRequestToOtherBranch(
    gitFlowBranchInfo,
    branchList.filter((v) => !releaseBranchList.includes(v)),
  );

  const config = {
    relBranch,
    targetPrBranchInfo,
  };
  await askPullRequestConfigConfirm(config);

  return config;
};
