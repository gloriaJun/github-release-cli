import inquirer from 'inquirer';

import { IGitFlowBranchInfo } from '../interface';

const getReleaesTagInfo = async (targetBranch: string, name: string) => {
  const askCondition = (answers: inquirer.Answers) => {
    return answers.isCreateRelease as boolean;
  };

  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isCreateRelease',
      message: 'Do you want to do the release process?',
      default: true,
    },
    {
      type: 'input',
      name: 'tagName',
      message: 'Input tag name',
      default: name,
      when: askCondition,
    },
    {
      type: 'input',
      name: 'releaseName',
      message: 'Input release name',
      default: name,
      when: askCondition,
    },
    {
      type: 'input',
      name: 'targetCommitish',
      message: 'Input target branch',
      default: targetBranch,
      when: askCondition,
    },
  ]);
};

export const askReleaseProcess = async (
  gitFlowBranchInfo: IGitFlowBranchInfo,
  relBranch: string,
) => {
  const prefix = gitFlowBranchInfo.release;
  return await getReleaesTagInfo(
    gitFlowBranchInfo.master,
    relBranch.replace(prefix, ''),
  );
};
