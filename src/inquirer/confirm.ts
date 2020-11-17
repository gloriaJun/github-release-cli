import { IReleaseConfig } from '../interface';
import { inquirerConfirmQuestion } from './shared';

export const askConfigConfirm = async (config: IReleaseConfig) => {
  console.log('### release config - ', config);

  return await inquirerConfirmQuestion(
    {
      message: `Do you want to continue?`,
      default: true,
    },
    'isContinue',
  );
};
