const TelegramApi = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config()

const token = process.env.TOKEN;
const APIKEY = process.env.APIKEY;
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=${APIKEY}`;

const rawData = fs.readFileSync('db.txt');
let subscribers = rawData.length > 0 ? JSON.parse(rawData) : [];
const bot = new TelegramApi(token, { polling: true });

const INTERVAL = 3 * 3600 * 1000; // 3 hours
// const INTERVAL = 3 * 1000; // 3 seconds for tests
let currentInterval = 1;

const options = {
  subscribe: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Weather in Kyiv: 3 hours update', callback_data: '3h_subscribe' },
          { text: 'Weather in Kyiv: 6 hours update', callback_data: '6h_subscribe' }
        ],
      ],
    })
  },
  unsubscribe: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Unsubscribe', callback_data: 'unsubscribe' },
        ],
      ],
    })
  },
  forecast: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Forecast in Kyiv', callback_data: 'forecastKyiv' },
        ],
      ],
    })
  }
}


bot.onText(/\/start/, (data) => {
  bot.sendMessage(data.from.id, "Forecast in Kyiv", options.forecast);
});

bot.on('callback_query', (callbackQuery) => {
  const action = callbackQuery.data;
  const index = subscribers.findIndex(s => s.chatId === callbackQuery.from.id);

  if (action === '3h_subscribe') {
    bot.sendMessage(callbackQuery.from.id, "Subscribed to weather update every 3 hours", options.unsubscribe);
    if (index === -1) {
      subscribers.push({ chatId: callbackQuery.from.id, interval: 1 });
    } else {
      subscribers[index].interval = 1;
    }
  } else if (action === '6h_subscribe') {
    bot.sendMessage(callbackQuery.from.id, "Subscribed to weather update every 6 hours", options.unsubscribe);
    if (index === -1) {
      subscribers.push({ chatId: callbackQuery.from.id, interval: 2 });
    } else {
      subscribers[index].interval = 2;
    }
  } else if (action === 'unsubscribe') {
    subscribers = subscribers.filter(s => s.chatId !== callbackQuery.from.id);
    bot.sendMessage(callbackQuery.from.id, "You have unsubscribed!", options.subscribe);
  } else if (action === 'forecastKyiv') {
    bot.sendMessage(callbackQuery.from.id, "Subscribe to weather", options.subscribe);
  } else {
    return;
  }

  fs.writeFileSync('db.txt', JSON.stringify(subscribers, null, 2));
});


setInterval(() => {
  currentInterval++;

  axios.get(WEATHER_URL)
    .then(function (data) {
        const weather = data.data;

        for (let subscriber of subscribers) {
          if (currentInterval % subscriber.interval === 0) {
            bot.sendMessage(subscriber.chatId, `Weather in ${weather.name}\n`
              + `Temperature: ${Math.round((weather.main.temp - 273.15) * 100) / 100} C\n`
              + `Feels like: ${Math.round((weather.main.feels_like - 273.15) * 100) / 100} C\n`
              + `Humidity: ${weather.main.humidity}\n`
              + `${weather.weather[0].main}, Wind speed: ${weather.wind.speed} m/s\n`
              + `Sunset at: ${new Date(weather.sys.sunset*1000).toLocaleTimeString()}`,
              {}
            );
          }
        }
      }
    );
}, INTERVAL);
