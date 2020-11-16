import inquirer from 'inquirer';

import { IGitAuthConfig } from '../interface';
import { isNotEmpty } from '../utility';

const getBaseApiUrl = async () => {
  const { baseUrl } = (await inquirer.prompt([
    {
      type: 'input',
      name: 'baseUrl',
      message: 'API endpoint',
      default: 'https://api.github.com',
    },
  ])) as inquirer.Answers;

  return baseUrl as string;
};

const getToken = async () => {
  let token;

  do {
    const answer = (await inquirer.prompt([
      {
        type: 'input',
        name: 'token',
        message: 'OAuth2 token',
        default: null,
      },
    ])) as inquirer.Answers;
    token = answer.token as string;
  } while (!token);

  return token;
};

export const inquirerAuthConfig = async (config: IGitAuthConfig) => {
  return {
    baseUrl: isNotEmpty(config.baseUrl)
      ? config.baseUrl
      : await getBaseApiUrl(),
    token: isNotEmpty(config.token) ? config.token : await getToken(),
  };
};
