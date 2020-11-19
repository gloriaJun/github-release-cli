#!/usr/bin/env node

import commander from 'commander';

import pkg from '../package.json';
import { setConfiguration } from './config';
import { askPullRequestProcess } from './inquirer';

commander.version(pkg.version, '-v, --version').description(pkg.description);

/*******************************************/
/* register command
/*******************************************/

commander
  .command('release [configFile]')
  .description('release the release branch')
  // function to execute when command is uses
  .action(async (configFile = '.env') => {
    console.log('### release branch - ', configFile);

    const gitFlowBranchInfo = await setConfiguration(configFile);
    const prConfig = await askPullRequestProcess(gitFlowBranchInfo);

    if (!prConfig) {
      return;
    }

    // do something
    console.log('do git action');
    console.log('ask release process and do it');
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
