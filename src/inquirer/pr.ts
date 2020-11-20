import inquirer from 'inquirer';

import { getBranchList } from '../api';
import {
  IGitFlowBranchInfo,
  IBranchPrInfo,
  IGeneralObject,
  IPullRequestConfig,
} from '../interface';
import { askPullRequestConfigConfirm } from './confirm';
import { inquirerConfirmQuestion } from './shared';

const getReleaseBranch = async (list: Array<string>) => {
  if (!list || list.length === 0) {
    throw `[Error] The selectable branch list is empty ... ✋`;
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
  basicBranchInfo: IGitFlowBranchInfo,
  list: Array<string>,
) => {
  const targetBranchList = [basicBranchInfo.master];

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
  basicBranchInfo: IGitFlowBranchInfo,
  list: Array<string>,
) => {
  const targetBranchList = getTargetBranchList(basicBranchInfo, list);

  const targetBranchAnswer = await targetBranchList.reduce(
    async (promise: Promise<IGeneralObject<IBranchPrInfo>>, branch: string) => {
      const result = await promise.then();
      const defaultValue = [basicBranchInfo.master].includes(branch);

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

export const askPullRequestProcess = async (
  gitFlowBranchInfo: IGitFlowBranchInfo,
): Promise<IPullRequestConfig> => {
  const prefix = gitFlowBranchInfo.release;
  const allList = await getBranchList();

  const releaseBranchList = allList.filter((v) => new RegExp(prefix).test(v));

  const relBranch = await getReleaseBranch(releaseBranchList);
  const targetPrBranchInfo = await checkPullRequestToOtherBranch(
    gitFlowBranchInfo,
    allList.filter((v) => !releaseBranchList.includes(v)),
  );

  const config = {
    relBranch,
    targetPrBranchInfo,
  };

  const answer = await askPullRequestConfigConfirm(config);
  if (!answer) {
    throw `Canceled Process ... ✋`;
  }

  return config;
};
