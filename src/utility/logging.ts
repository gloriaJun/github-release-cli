import { EOL } from 'os';
import pad from 'pad';
import chalk from 'chalk';

import { isEmpty } from './object';
import { IGeneralObject } from '../interface';

const paddingSize = 20;

const log = (...args: any[]) => {
  console.log(...args);
};

const newLine = () => {
  log(EOL);
};

export default {
  info: (message: string) => {
    log(message);
  },
  infoKeyValue: (key: string, value: string | number) => {
    log(pad(`${key}: `, paddingSize), chalk.green(value as string));
  },
  success: (message: string) => {
    log(chalk.green(`✔`), message);
  },
  error: (...args: any[]) => {
    console.error(chalk.bgBlack.red('ERROR!!!'), ...args);
    newLine();
  },
  newLine,

  // about the processing step
  stepTitle: (title: string, info?: string) => {
    newLine();
    newLine();
    log(`🚀 ${title}`, info ? chalk.bold(info) : '');
  },
  preview: ({ title, text }: IGeneralObject<string>) => {
    if (!isEmpty(text)) {
      title && log(chalk.bold(title));
      log('------------------------------------');
      log(`${text}`);
      log('------------------------------------');
    } else {
      log(`Empty ${title || ''}`);
    }
  },
  url: (url: string) => {
    log(`🔗  ${url}`);
  },
};
