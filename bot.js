import Telegraf from "telegraf";
import fetch from "node-fetch";
import { Keyboard } from "telegram-keyboard";

const bot = new Telegraf("5730057053:AAHhOtCv7JG9DR62AebQyROIAFIsZSwRPM0");
const apiUrl = "https://animechan.vercel.app/api/";
const getData = (cmd, ctx) => {
    fetch(apiUrl + cmd)
      .then((response) => response.json())
      .then((quote) => {
        if (cmd == "random") {
          ctx.reply(
            `
            ⛩Anime: ${quote["anime"]}
👤Character: ${quote["character"]}

"${quote["quote"]}"
            `
          );
        } else {
          if (quote["error"] == "No related quotes found!") {
            ctx.reply(quote["error"]);
          } else {
            let number = Math.floor(Math.random() * quote.length);
            ctx.reply(
              `
              ⛩Anime: ${quote[number]["anime"]}
👤Character: ${quote[number]["character"]}

"${quote[number]["quote"]}"
              `
            );
          }
        }
      });
};
bot.start((ctx) => {
  ctx.reply(`Hello👋`);
  const keyboard = Keyboard.make([
    ["Title name✏️"],
    ["Character name👤"],
    ["Random🎲"],
  ]);
  ctx.reply("Get quotes by ...", keyboard.reply());
});
bot.hears("Title name✏️", (ctx) => {
  ctx.reply("Ok, send me title of the anime");
  bot.use((ctx, next) => {
    let text = ctx.message.text;
    getData(`quotes/anime?title=${text}`, ctx);
    // next();
  });
});
bot.hears("Character name👤", (ctx) => {
  ctx.reply("Ok, send me character's name");
  bot.use((ctx, next) => {
    let text = ctx.message.text;
    getData(`quotes/character?name=${text}`, ctx);
    // next();
  });
});
bot.hears("Random🎲", (ctx) => {
  getData("random", ctx);
});

bot.launch();
