const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const prefix = "$";
const fetch = require('node-fetch');

const coinbase = "https://api.coinbase.com/v2/prices/spot?currency=USD";
const bitmex = "https://www.bitmex.com/api/v1/trade/bucketed?binSize=1m&partial=true&count=100&reverse=true";
const binance = "https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT";


client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.on("message", function(message) {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;

      const commandBody = message.content.slice(prefix.length);
      const args = commandBody.split(' ');
      const command = args.shift().toLowerCase();

      if (command === "coin") {
        (async () => {
          try {
            const coinbase_spot_price = await fetch(coinbase).then(response => response.json());
            const bitmex_spot_price = await fetch(bitmex).then(response => response.json());
            const binance_spot_price = await fetch(binance).then(response => response.json());

            const timeTaken = Date.now() - message.createdTimestamp;

            let binance_price = binance_spot_price.price;
            binance_price = binance_price.slice(0, -6);

            message.reply(`Current Prices of Bitcoin in USD
              Coinbase: ${coinbase_spot_price.data.amount}
              Bitmex: ${bitmex_spot_price[4].close}
              Binance: ${binance_price}`);

            console.log(`This message had a latency of ${timeTaken}ms.`);
          } catch (error) {
            console.log(error.response.body);
          }
        })();

    }

    });
})

client.login(config.BOT_TOKEN)
