const readline = require("readline/promises");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  do {
    const input = await rl.question('Please, enter words or numbers, divided by spaces: ');
    if (input === "exit") {
      rl.close();
      return;
    }

    console.log(`Your input: ${input}`);
    console.log(
      "1. Sort words alphabetically\n" +
      "2. Show numbers from lesser to greater\n" +
      "3. Show numbers from bigger to smaller\n" +
      "4. Display words in ascending order by number of letters in the word\n" +
      "5. Show only unique words\n" +
      "6. Display only unique values from the set of words and numbers entered by the user\n" +
      "7. To exit the program, type `exit`"
    );
    let arr = input.trim().split(' ');
    let res;
    let choice = undefined;
    do {
      choice = await rl.question('Your choice: ');
      let filteredArr;
      switch (choice) {
        case "1":
          filteredArr = arr.filter(el => isNaN(el));
          res = filteredArr.sort();
          break;
        case "2":
          filteredArr = arr.filter(el => !isNaN(el));
          res = filteredArr.sort((a, b) => a - b);
          break;
        case "3":
          filteredArr = arr.filter(el => !isNaN(el));
          res = filteredArr.sort((a, b) => b - a);
          break;
        case "4":
          filteredArr = arr.filter(el => isNaN(el));
          res = filteredArr.sort((a, b) => a.length - b.length)
          break;
        case "5":
          filteredArr = arr.filter(el => isNaN(el));
          res = [...new Set(filteredArr)];
          break;
        case "6":
          res = [...new Set(arr)];
          break;
        case "exit":
          rl.close();
          return;
        default:
          choice = undefined;
          console.log("No such option. Please select valid option")
      }
    } while (!choice);
    console.log("Here is your result:", res);
  } while (true);
}

main();








