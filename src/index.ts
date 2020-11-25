import commander from 'commander';
import { exit } from 'process';

import pkg from '../package.json';
import { setConfiguration } from './config';
import { pkgVersions } from './constants';
import { runReleaseProcess } from './release';
import { logging } from './utility';

const defaultConfigPath = '.env';
const pkgVersionList = Object.keys(pkgVersions);

export function run() {
  const checkCommonOptions = () => {
    return setConfiguration(commander.config as string);
  };

  commander
    .version(pkg.version, '-v, --version')
    .arguments('<cmd> [options]')
    .description(pkg.description)
    .option('-c, --config <path>', `set config path`, defaultConfigPath);

  commander
    .command(`release <type>`)
    .alias('rel')
    .description('excute the release process', {
      type: pkgVersionList.join(' | '),
    })
    .action(async (type) => {
      if (!pkgVersionList.includes(type)) {
        logging.error(`Invalid release type: `, type);
        exit(1);
      }

      const config = await checkCommonOptions();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await runReleaseProcess({ releaseType: type, ...config });
    });

  commander.parse(process.argv);
}
