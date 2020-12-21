import commander from 'commander';
import { exit } from 'process';

import { loadReleaseConfig } from 'src/config';
import { runReleaseProcess } from 'src/release';
import { logging } from 'src/utility';
import { api } from 'src/service';
import { releaseTypes } from 'src/types';

import pkg from '../package.json';

const defaultConfigPath = '.config/release.yml';

export function run() {
  const initConfiguration = async () => {
    const config = await loadReleaseConfig(commander.config as string);
    api.setConfiguration(config);
    return config;
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
      type: releaseTypes.join(' | '),
    })
    .action(async (type) => {
      if (!releaseTypes.includes(type)) {
        logging.error(`Invalid release type: `, type);
        exit(1);
      }

      const config = await initConfiguration();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await runReleaseProcess(type, config);
    });

  commander.parse(process.argv);
}
