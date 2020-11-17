import inquirer from 'inquirer';

import { getBranchList } from '../action';
import {
  IBranchInfo,
  IBranchPrInfo,
  IGeneralObject,
  IReleaseConfig,
} from '../interface';
import { isNotEmpty } from '../utility';
import { inquirerConfirmQuestion, inquirerRequiredQuestion } from './shared';

const branchInfo: IGeneralObject<string> = {
  master: 'main',
  develop: 'develop',
  release: 'release/',
  hotfix: 'hotfix/',
};

const getReleaseBranch = async (list: Array<string>) => {
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

const getTargetBranchList = (list: Array<string>) => {
  const targetBranchList = [branchInfo.master];

  if (list.includes(branchInfo.develop)) {
    targetBranchList.push(branchInfo.develop);
  }

  list
    .filter((v) => !targetBranchList.includes(v))
    .map((v) => {
      targetBranchList.push(v);
    });

  return targetBranchList;
};

const checkPullRequestToOtherBranch = async (list: Array<string>) => {
  const targetBranchList = getTargetBranchList(list);

  const targetBranchAnswer = await targetBranchList.reduce(
    async (promise: Promise<IGeneralObject<IBranchPrInfo>>, branch: string) => {
      const result = await promise.then();
      const defaultValue = [branchInfo.master].includes(branch);

      const isCreate = await inquirerConfirmQuestion(
        {
          message: `Create PR to '${branch}' branch`,
          default: defaultValue,
        },
        'isCreate',
      );

      const isMerge =
        isCreate &&
        (await inquirerConfirmQuestion(
          {
            message: `Merge PR to '${branch}' branch`,
            default: defaultValue,
          },
          'isMerge',
        ));

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

export const setBranchPrefix = (info: IBranchInfo) => {
  const keys = Object.keys(info) as Array<keyof IBranchInfo>;

  keys.map((k: keyof IBranchInfo) => {
    if (isNotEmpty(info[k])) {
      branchInfo[k] = info[k];
    }
  });
};

export const askReleaseProcess = async (): Promise<IReleaseConfig> => {
  const prefix = branchInfo.release;
  const allList = await getBranchList();

  const releaseBranchList = allList.filter((v) => new RegExp(prefix).test(v));

  const relBranch = await getReleaseBranch(releaseBranchList);
  const tagName = await getTagName(relBranch.replace(prefix, ''));
  const targetPrBranchInfo = await checkPullRequestToOtherBranch(
    allList.filter((v) => v !== relBranch),
  );

  return {
    relBranch,
    tagName,
    targetPrBranchInfo,
  };
};
