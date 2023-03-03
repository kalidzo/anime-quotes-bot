import Telegraf from "telegraf";
import fetch from "node-fetch";
import { Keyboard } from "telegram-keyboard";
import { translate } from "google-translate-api-browser";

// Bot Setup
const bot = new Telegraf("5730057053:AAHhOtCv7JG9DR62AebQyROIAFIsZSwRPM0");
const apiUrl = "https://animechan.vercel.app/api/";

let language;

const getData = (cmd, ctx) => {
  fetch(apiUrl + cmd)
    .then((response) => response.json())
    .then((quote) => {
      if (cmd == "random") {
        async function run(line) {
          const data = await translate(line, { from: language[1], to: language[0] });
          return data;
        }
        async function getIt() {
          let res = await run(quote["quote"]);
          ctx.reply(
            `
            ⛩Anime: ${quote["anime"]}
${language[0]=="uz" ? "👤Qahramon" : "👤Character"}: ${quote["character"]}
  
"${res["text"]}"
              `
          );
        }
        getIt();
      } else {
        if (quote["error"] == "No related quotes found!") {
								ctx.reply((language[0]=="uz" ? "Aloqador matn topilmadi!" : quote["error"]));
        } else {
          let number = Math.floor(Math.random() * quote.length);

          async function run(line) {
            const data = await translate(line, {
              from: language[1],
              to: language[0],
            });
            return data;
          }
          async function getIt() {
            let res = await run(quote[number]["quote"]);
            ctx.reply(
              `
              ⛩Anime: ${quote[number]["anime"]}
${language[0]=="uz" ? "👤Qahramon" : "👤Character"}: ${quote[number]["character"]}

"${res["text"]}"
              `
            );
          }
          getIt();
        }
      }
    });
};
bot.start((ctx) => {
  ctx.reply(`Hello👋`);
  const keyboard = Keyboard.make([["🇺🇸","🇺🇿"]]);
  ctx.reply(
    `Tilni tanlang:
Select the language:
  `,
    keyboard.reply()
  );
});
bot.hears(["🇺🇸","English 🇺🇸"], (ctx) => {
  language = ["en", "uz"];
  const keyboard = Keyboard.make([
    ["Title name✏️"],
    ["Character name👤"],
    ["Random🎲"],
    ["O'zbekcha 🇺🇿"]
  ]);
  ctx.reply("Get quotes by ...", keyboard.reply());
});

bot.hears(["🇺🇿","O'zbekcha 🇺🇿"],  (ctx) => {
  language = ["uz", "en"];
  const keyboard = Keyboard.make([
    ["Anime nomi✏️"],
    ["Qahramon ismi👤"],
    ["Tasodifiy🎲"],
	  ["English 🇺🇸"]
  ]);
  ctx.reply("Matnlarni qaysi usulda qidirmoqchisiz ...", keyboard.reply());
});

bot.hears((["Title name✏️","Anime nomi✏️"]), (ctx) => {
  if (language[0] == "uz") {
    ctx.reply("Ho'p, menga anime nomini yuboring")
  }else{
    ctx.reply("Ok, send me title of the anime");
  }
  
  bot.use((ctx, next) => {
    let text = ctx.message.text;
    getData(`quotes/anime?title=${text}`, ctx);
  });
});
bot.hears(["Character name👤","Qahramon ismi👤"], (ctx) => {
  if (language[0] == "uz") {
    ctx.reply("Ho'p, menga qahramon ismini yuboring");
  } else {
    ctx.reply("Ok, send me character's name");
  }
  
  bot.use((ctx, next) => {
    let text = ctx.message.text;
    getData(`quotes/character?name=${text}`, ctx);
  });
});
bot.hears(["Random🎲","Tasodifiy🎲"], (ctx) => {
  getData("random", ctx);
});

bot.launch();

