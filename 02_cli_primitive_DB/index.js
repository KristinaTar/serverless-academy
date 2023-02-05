import inquirer from 'inquirer';
import fs from 'fs';

const questions = [
  {
    type: 'input',
    name: 'userName',
    message: 'Enter the user name. To cancel press Enter: ',
    filter: input => {
      return input.trim();
    },
  },
  {
    type: 'list',
    name: 'sex',
    message: 'Chose your gender: ',
    choices: ['male', 'female'],
    when: hasNotCancelled,
  },
  {
    type: 'input',
    name: 'age',
    message: 'Enter your age:',
    when: hasNotCancelled,
    validate(value) {
      if (!isNaN(value) && Number(value) > 0) {
        return true;
      }

      return 'Please enter a valid number';
    },
    filter: input => {
      return Number.isNaN(input) || Number(input) <= 0 ? '' : Number(input);
    },
  },
];

function hasNotCancelled(answers) {
  return answers.userName !== '';
}

async function main() {
  const rawData = fs.readFileSync('db.txt');
  let users = rawData.length > 0 ? JSON.parse(rawData) : [];

  while (true) {
    const answers = await inquirer.prompt(questions);

    if (answers.userName === "") {
      break;
    }

    users = [...users, answers];
  }

  fs.writeFileSync('db.txt', JSON.stringify(users, null, 2));

  if (users.length < 2) {
    return;
  }
  let search = await inquirer.prompt([{
    type: 'confirm',
    name: 'search',
    message: 'Would you search values in DB?',
    default: false,
  }]);

  if (!search.search) {
    return;
  }

  console.log(users);

  search = await inquirer.prompt([{
    type: 'input',
    name: 'text',
    message: "Enter user's name you want to find in DB:",
    validate(value) {
      if (value.length > 0) {
        return true;
      }

      return 'Please enter a valid search text';
    },
  }]);

  const searchResult = users.filter(user => user.userName.toLowerCase() === search.text.toLowerCase());
  if (searchResult.length > 0) {
    console.log(searchResult)
  } else {
    console.log("No such users")
  }
}

main();

