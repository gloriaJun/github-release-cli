export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

export const isNotEmpty = (str: string): boolean => {
  return !isEmpty(str);
};
