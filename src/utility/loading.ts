import ora, { Ora } from 'ora';

const spinner: Ora = ora();

export default {
  start: (message = '') => {
    spinner.start(`Loading ${message}...`);
  },
  stop: () => {
    spinner.stop();
  },
};
