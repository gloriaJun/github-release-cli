#!/usr/bin/env node

import commander from 'commander';

import pkg from '../package.json';
import { pullRequestAction, releaseAction } from './action';
import { setConfiguration } from './config';
import { logging } from './utility';

commander.version(pkg.version, '-v, --version').description(pkg.description);

/*******************************************/
/* register command
/*******************************************/

commander
  .command('release [configFile]')
  .description('release the release branch')
  // function to execute when command is uses
  .action(async (configFile = '.env') => {
    try {
      const gitFlowBranchInfo = await setConfiguration(configFile);

      const relBranch = await pullRequestAction(gitFlowBranchInfo);
      const html_url = await releaseAction(gitFlowBranchInfo, relBranch);

      logging.info(`Success release ${relBranch} 🎉🎉🎉`);
      logging.info(`You can check the release note -> ${html_url}`);
    } catch (e) {
      console.log(e);
    }
  });

// commander
//   .command('hotfix')
//   .description('release the hotfix branch')

//   // function to execute when command is uses
//   .action(function (branch) {
//     console.log('### hotfix', branch);
//     // getBranchList();

//     const result = dotenv.config({ path: './.env' });
//     if (result.error) {
//       console.error('can not read file');
//     }

//     console.log('parse', result.parsed);
//   });

/*******************************************/
/* main
/*******************************************/

// allow commander to parse `process.argv`
commander.parse(process.argv);
