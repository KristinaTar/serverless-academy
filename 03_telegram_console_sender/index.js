const TelegramApi = require('node-telegram-bot-api');
const { program } = require('commander');
require('dotenv').config()

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;
process.env["NTBA_FIX_350"] = 1;

const bot = new TelegramApi(token);

program
  .description('Sends message or photo to the bot')
  .option('-m, --message <string>', 'Sends specific message to the bot.' +
    '\nExample: -m "Hello!"')
  .option('-p, --photo <string>', 'Sends photo with specific path to the bot' +
    '\nExample: -p "./img/1.jpg"');

program.parse();

const options = program.opts();

if (options.message) {
  bot.sendMessage(chatId, options.message);
}

if (options.photo) {
  bot.sendPhoto(
    chatId,
    options.photo
  );
}


