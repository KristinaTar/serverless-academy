const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config()

const token = process.env.TOKEN;
const axios = require('axios');

const PrivatAPI = "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5";
const bot = new TelegramApi(token, { polling: true });


bot.onText(/\/start|Back to menu/, (data) => {
  bot.sendMessage(data.from.id, "Welcome to PrivatBank Exchange Rates bot", {
    reply_markup: {
      keyboard: [["Currency Rates"]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/Currency Rates/, (data) => {
  bot.sendMessage(data.from.id, "Please chose currency", {
    reply_markup: {
      keyboard: [["EUR", "USD"], ["Back to menu"]],
      resize_keyboard: true,
    },
  });
});


bot.onText(/EUR/, (data) => {
  sendRates(data.from.id, "EUR");
});

bot.onText(/USD/, (data) => {
  sendRates(data.from.id, "USD");
});


function sendRates(chatId, currency) {
  axios.get(PrivatAPI).then(
    (res) => {
      const rates = res.data.find(el => el.ccy === currency);
      bot.sendMessage(
        chatId,
        `${currency} rates ${rates.base_ccy}/${currency}: ` +
        "\nSell: " + (+rates.sale).toFixed(2) +
        "\nBuy: " + (+rates.buy).toFixed(2)
      );
    }
  )
}
