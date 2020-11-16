#!/usr/bin/env node

import commander from 'commander';

import pkg from '../package.json';
import { setConfiguration } from './config';
// import { getBranchList } from './action';

/*******************************************/
// const apiUrl = 'https://git.linecorp.com/api/v3/';
// const owner = 'gloriaJun';
// const repo = 'github-release-cli.git';
/*******************************************/

commander.version(pkg.version, '-v, --version').description(pkg.description);

/*******************************************/
/* register command
/*******************************************/

commander
  .command('release <branch> [configFile]')
  .description('release the release branch')
  // function to execute when command is uses
  .action(async (branch, configFile) => {
    console.log('### release branch - ', branch, configFile);

    await setConfiguration(configFile);
    // getBranchList();
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
