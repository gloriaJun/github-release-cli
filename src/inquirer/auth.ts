import { inquirerRequiredQuestion } from './shared';

export const getBaseApiUrl = async () => {
  return await inquirerRequiredQuestion(
    {
      type: 'input',
      message: 'API endpoint',
      default: 'https://api.github.com',
    },
    'baseUrl',
  );
};

export const getToken = async () => {
  return await inquirerRequiredQuestion(
    {
      type: 'input',
      message: 'OAuth2 token',
      default: null,
    },
    'token',
  );
};

export const getRepoOwner = async () => {
  return await inquirerRequiredQuestion(
    {
      type: 'input',
      message: 'Repo Owner',
      default: null,
    },
    'owner',
  );
};

export const getRepoName = async () => {
  return await inquirerRequiredQuestion(
    {
      type: 'input',
      message: 'Repo Name',
      default: null,
    },
    'repo',
  );
};
