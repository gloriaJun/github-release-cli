import { isNotEmpty } from './object';

export const parseEnvConfigString = (key: string): string => {
  return process.env[key] as string;
};

export const parseEnvConfigByKey = async (
  envKey: string,
  cb: () => Promise<string>,
): Promise<string> => {
  const val = parseEnvConfigString(envKey);

  return isNotEmpty(val) ? val : await cb();
};
