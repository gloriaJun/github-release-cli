import commander from 'commander';

import pkg from '../package.json';
import { pullRequestAction, releaseAction } from './action';
import { setConfiguration } from './config';
import { IGitFlowBranchInfo } from './interface';
import { logging } from './utility';

const main = async (target: keyof IGitFlowBranchInfo, configFile = '.env') => {
  try {
    const gitFlowBranchInfo = await setConfiguration(configFile);

    const relBranch = await pullRequestAction(
      gitFlowBranchInfo[target],
      gitFlowBranchInfo,
    );
    const html_url = await releaseAction(gitFlowBranchInfo, relBranch);

    logging.info(`Success release ${relBranch} 🎉🎉🎉`);
    logging.info(`You can check the release note -> ${html_url}`);
  } catch (e) {
    console.log(e);
  }
};

commander.version(pkg.version, '-v, --version').description(pkg.description);

/*******************************************/
/* register command
/*******************************************/

commander
  .command('release [configFile]')
  .description('release the release branch')
  // function to execute when command is uses
  .action(async (configFile) => {
    await main('release', configFile);
  });

commander
  .command('hotfix [configFile]')
  .description('release the hotfix branch')
  // function to execute when command is uses
  .action(async (configFile = '.env') => {
    await main('hotfix', configFile);
  });
/*******************************************/
/* main
/*******************************************/

// allow commander to parse `process.argv`
commander.parse(process.argv);
