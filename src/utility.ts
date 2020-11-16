export const isEmpty = (str: string) => {
  return !str || str.trim().length === 0;
};

export const isNotEmpty = (str: string) => {
  console.log('#### empty ? ', str);
  return !isEmpty(str);
};
