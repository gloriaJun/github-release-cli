import pad from 'pad';
import colors from 'colors';

const paddingSize = 20;

export default {
  info: (message: string) => {
    console.log(message);
  },
  infoKeyValue: (key: string, value: string | number) => {
    console.log(pad(`${key}: `, paddingSize), colors.green(value as string));
  },
  error: (message: string) => {
    console.error(message);
  },
};
