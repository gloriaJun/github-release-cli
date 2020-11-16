import dotenv from 'dotenv';

import { inquirerAuthConfig } from './inquirer';
import { IGitAuthConfig } from './interface';

// export let releaseConfig = {};

export const setConfiguration = async (path: string) => {
  const config = dotenv.config({ path });

  if (config.error) {
    console.error('can not read file');

    // const answer = await inquirerAuthConfig();
    // console.log('------------------');
    // console.log(answer);
    // console.log('------------------');
  } else {
    console.log('parse', config.parsed);

    // for (const k in config) {
    //   releaseConfig[k] = config[k];
    // }
  }

  const { baseUrl, token } = config as IGitAuthConfig;
  console.log('###### =-==== ', baseUrl, token);
  const answer = await inquirerAuthConfig(config as IGitAuthConfig);
  console.log('------------------');
  console.log(answer);
  console.log('------------------');
};
