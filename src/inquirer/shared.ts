import inquirer from 'inquirer';

export const inquirerRequiredQuestion = async (
  question: inquirer.Question,
  key: string,
) => {
  let value;

  do {
    const answer = await inquirer.prompt([
      {
        name: key,
        ...question,
      },
    ]);

    value = answer[key] as string;
  } while (!value);

  return value;
};

export const inquirerConfirmQuestion = async (
  question: inquirer.Question,
  key: string,
) => {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: key,
      ...question,
    },
  ]);

  return (answer[key] as boolean) || false;
};
