const isgd = require("isgd-api");
const tiktok = require("tiktok-scraper-without-watermark");
const checkURL = require("is-url");
const emojisGetter = require("get-emojis-from-string");

const { tax } = require("probot-taxs");
const { MessageEmbed } = require("discord.js");

function taxCalc(message) {
  let amount = getVal(message.content) || parseInt(message.content);
  if (!amount) return message.react("❌").catch(() => tax(1));

  let result = tax(amount, true);
  let embed = new MessageEmbed()
    .setColor("#5865F2")
    .setTitle("• Tax Calculator")
    .setDescription(
      `**» ProBot:**\n\`${result.tax - amount}\`\n**» Mediator:**\n\`${
        result.wasit - amount
      }\`\n**» Price with ProBot tax:**\n\`${
        result.tax
      }\`\n**» Price with All Taxes:**\n\`${result.wasit}\``
    )
    .setThumbnail(
      message.author.displayAvatarURL({
        dynamic: true,
        size: 512,
      })
    )
    .setFooter({
      text: "Made By mahmoud#0003",
      iconURL: message.guild.iconURL({
        dynamic: true,
      }),
    });

  message.channel.send({
    embeds: [embed],
  });
}

function emojiDownloader(message) {
  let emojis =
    emojisGetter(message.content) || message.react("❌").catch(() => tax(1));
  if (emojis.length < 1) return message.react("❌").catch(() => tax(1));

  emojis.forEach((emoji) => {
    isgd
      .shorten(emoji.image)
      .then((result) =>
        message.channel.send({
          content: `<${result}>`,
          files: [emoji.image],
        })
      )
      .catch(() => message.react("❌").catch(() => tax(1)));
  });
}

function shortURL(message) {
  let isUrl = checkURL(message.content);
  if (!isUrl) return message.react("❌").catch(() => tax(1));

  isgd
    .shorten(message.content)
    .then((result) => message.channel.send(result))
    .catch(() => message.react("❌").catch(() => tax(1)));
}

function tiktokDownload(message) {
  let check = checkURL(message.content);
  if (!check) return message.react("❌").catch(() => tax(1));

  tiktok
    .tiktokdownload(message.content)
    .then(async (result) => {
      isgd
        .shorten(result.nowm)
        .then((result) => message.channel.send(result))
        .catch(() => message.react("❌").catch(() => tax(1)));
    })
    .catch(() => message.react("❌").catch(() => tax(1)));
}


function getVal(val) {
  multiplier = val.substr(-1).toLowerCase();
  if (multiplier == "k") return parseFloat(val) * 1000;
  else if (multiplier == "m") return parseFloat(val) * 1000000;
}

module.exports = {
  taxCalc,
  emojiDownloader,
  shortURL,
  tiktokDownload,
};
