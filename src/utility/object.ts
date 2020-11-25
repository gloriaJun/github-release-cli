export const isEmpty = (str: string | undefined): boolean => {
  return !str || str.trim().length === 0;
};

export const isNotEmpty = (str: string | undefined): boolean => {
  return !isEmpty(str);
};
