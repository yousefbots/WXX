require("dotenv").config({ path: "./storage/.env" });

// Discord Client
const { Client, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_EMOJIS_AND_STICKERS"],
  allowedMentions: { repliedUser: false },
});

// MongoDB
const mongoose = require("mongoose");
const schema = require("./storage/guild");
mongoose.connect(process.env.MONGO);

// Others
const {
  taxCalc,
  emojiDownloader,
  shortURL,
  tiktokDownload,
} = require("./storage/functions");
const prefix = "&";

// Client Events
client.on("ready", () => {
  client.user.setActivity({
    name: `&help`,
    type: "COMPETING",
  });
  console.log(`I'm ready to help people!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (command == "help") {
      const embed = new MessageEmbed()
        .setTitle(`${client.user.username}'s command list!`)
        .setColor("RANDOM")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField(`**» ${prefix}help:**`, "> Show bot's command list!")
        .addField(`**» ${prefix}channels:**`, "> Show bot's channels!")
        .addField(`**» ${prefix}invite:**`, "> Get the invite link of the bot!")
        .addField(`**» ${prefix}toggle-tax:**`, `> Toggle ProBot tax (on/off)!`)
        .addField(
          `**» ${prefix}toggle-emoji:**`,
          `> Toggle emoji downloader (on/off)!`
        )
        .addField(
          `**» ${prefix}toggle-short:**`,
          `> Toggle URL Shortener (on/off)!`
        )
        .addField(
          `**» ${prefix}toggle-tiktok:**`,
          `> Toggle TikTok downloader (on/off)!`
        )
        .addField(
          `**» ${prefix}set-tax #channel:**`,
          `> Change ProBot tax's channel!`
        )
        .addField(
          `**» ${prefix}set-emoji #channel:**`,
          `> Change Emoji Downloader's channel!`
        )
        .addField(
          `**» ${prefix}set-short #channel:**`,
          `> Change URL Shortener's channel!`
        )
        .addField(
          `**» ${prefix}set-tiktok #channel:**`,
          `> Change TikTok Downloader without watermark's channel!`
        )
        .setFooter({
          text: "Made By mahmoud#0003",
          iconURL: message.guild.iconURL({ dynamic: true }),
        });
      message.reply({ embeds: [embed] });
    } else if (command == "set-tax") {
      const channel = message.mentions.channels.first();
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      if (!channel)
        return message.reply({
          content: `**:x: | You must mention the channel after the command!**`,
        });

      const check =
        (await schema.exists({ emoji: channel.id })) ||
        (await schema.exists({ short: channel.id })) ||
        schema.exists({ tiktok: channel.id });
      if (check._id)
        return message.reply({
          content: `**:x: | This channel is currently used!**`,
        });

      const data = await schema.findOneAndUpdate(
        { guildId: message.guildId },
        { tax: channel.id },
        { new: true }
      );
      if (data) {
        message.reply({
          content: `**:white_check_mark: | I've changed the tax channel!**`,
        });
      } else {
        await schema.create({ guildId: message.guildId, tax: channel.id });
        message.reply({
          content: `**:white_check_mark: | I've changed the tax channel!**`,
        });
      }
    } else if (command == "set-emoji") {
      const channel = message.mentions.channels.first();
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      if (!channel)
        return message.reply({
          content: `**:x: | You must mention the channel after the command!**`,
        });

      const check =
        (await schema.exists({ tax: channel.id })) ||
        (await schema.exists({ short: channel.id })) ||
        schema.exists({ tiktok: channel.id });
      if (check._id)
        return message.reply({
          content: `**:x: | This channel is currently used!**`,
        });

      const data = await schema.findOneAndUpdate(
        { guildId: message.guildId },
        { emoji: channel.id },
        { new: true }
      );
      if (data) {
        message.reply({
          content: `**:white_check_mark: | I've changed the emoji channel!**`,
        });
      } else {
        await schema.create({ guildId: message.guildId, emoji: channel.id });
        message.reply({
          content: `**:white_check_mark: | I've changed the emoji channel!**`,
        });
      }
    } else if (command == "set-short") {
      const channel = message.mentions.channels.first();
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      if (!channel)
        return message.reply({
          content: `**:x: | You must mention the channel after the command!**`,
        });

      const check =
        (await schema.exists({ emoji: channel.id })) ||
        (await schema.exists({ tax: channel.id })) ||
        schema.exists({ tiktok: channel.id });
      if (check._id)
        return message.reply({
          content: `**:x: | This channel is currently used!**`,
        });

      const data = await schema.findOneAndUpdate(
        { guildId: message.guildId },
        { short: channel.id },
        { new: true }
      );
      if (data) {
        message.reply({
          content: `**:white_check_mark: | I've changed the short channel!**`,
        });
      } else {
        await schema.create({ guildId: message.guildId, short: channel.id });
        message.reply({
          content: `**:white_check_mark: | I've changed the short channel!**`,
        });
      }
    } else if (command == "set-tiktok") {
      const channel = message.mentions.channels.first();
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      if (!channel)
        return message.reply({
          content: `**:x: | You must mention the channel after the command!**`,
        });

      const check =
        (await schema.exists({ emoji: channel.id })) ||
        (await schema.exists({ short: channel.id })) ||
        schema.exists({ tax: channel.id });
      if (check._id)
        return message.reply({
          content: `**:x: | This channel is currently used!**`,
        });

      const data = await schema.findOneAndUpdate(
        { guildId: message.guildId },
        { tiktok: channel.id },
        { new: true }
      );
      if (data) {
        message.reply({
          content: `**:white_check_mark: | I've changed the tiktok channel!**`,
        });
      } else {
        await schema.create({ guildId: message.guildId, tiktok: channel.id });
        message.reply({
          content: `**:white_check_mark: | I've changed the tiktok channel!**`,
        });
      }
    } else if (command == "toggle-tax") {
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      const data = await schema.findOne({ guildId: message.guildId });

      if (data && data.toggleTax == true) {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleTax: false },
          { new: true }
        );
        return message.reply({ content: `**:x: | I've toggle off the tax!**` });
      } else {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleTax: true },
          { new: true }
        );
        return message.reply({ content: `**:x: | I've toggle on the tax!**` });
      }
    } else if (command == "toggle-emoji") {
      const data = await schema.findOne({ guildId: message.guildId });

      if (data && data.toggleEmoji == true) {
        if (
          !message.member.permissions.has("ADMINISTRATOR") ||
          !message.member.permissions.has("MANAGE_GUILD")
        )
          return message.reply({
            content: `**:x: | You don't have permission to use this command!**`,
          });
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleEmoji: false },
          { new: true }
        );
        return message.reply({
          content: `**:x: | I've toggle off the emoji!**`,
        });
      } else {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleEmoji: true },
          { new: true }
        );
        return message.reply({
          content: `**:x: | I've toggle on the emoji!**`,
        });
      }
    } else if (command == "toggle-short") {
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      const data = await schema.findOne({ guildId: message.guildId });

      if (data && data.toggleShort == true) {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleShort: false },
          { new: true }
        );
        return message.reply({
          content: `**:x: | I've toggle off the short!**`,
        });
      } else {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleShort: true },
          { new: true }
        );
        return message.reply({
          content: `**:x: | I've toggle on the short!**`,
        });
      }
    } else if (command == "toggle-tiktok") {
      if (
        !message.member.permissions.has("ADMINISTRATOR") ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.reply({
          content: `**:x: | You don't have permission to use this command!**`,
        });
      const data = await schema.findOne({ guildId: message.guildId });

      if (data && data.toggleTikTok == true) {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleTikTok: false },
          { new: true }
        );
        return message.reply({
          content: `**:x: | I've toggle off the tiktok!**`,
        });
      } else {
        await schema.findOneAndUpdate(
          { guildId: message.guildId },
          { toggleTikTok: true },
          { new: true }
        );
        return message.reply({
          content: `**:x: | I've toggle on the tiktok!**`,
        });
      }
    } else if (command == "channels") {
      const data = await schema.findOne({ guildId: message.guildId });
      if (!data || !data.tax || !data.emoji || !data.short || !data.tiktok)
        return message.reply({
          content: `**:x: | There isn't channels used!**`,
        });

      const embed = new MessageEmbed()
        .setTitle(`${message.guild.name}'s channels`)
        .setColor("RANDOM")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: "Made By mahmoud#0003",
          iconURL: message.guild.iconURL({ dynamic: true }),
        });
      if (data.tax)
        embed.addField(
          `**» Tax (${data.toggleTax ? "ON" : "OFF"}):**`,
          `<#${data.tax}>`
        );
      if (data.emoji)
        embed.addField(
          `**» Emoji (${data.toggleEmoji ? "ON" : "OFF"}):**`,
          `<#${data.emoji}>`
        );
      if (data.short)
        embed.addField(
          `**» URL Shortener (${data.toggleShort ? "ON" : "OFF"}):**`,
          `<#${data.short}>`
        );
      if (data.tiktok)
        embed.addField(
          `**» TikTok Downloader (${data.toggleTikTok ? "ON" : "OFF"}):**`,
          `<#${data.tiktok}>`
        );

      message.reply({ embeds: [embed] });
    } else if (command == "invite") {
      const embed = new MessageEmbed()
        .setTitle(`${client.user.username}'s invite link`)
        .setColor("RANDOM")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `[Click Me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`
        )
        .setFooter({
          text: "Made By mahmoud#0003",
          iconURL: message.guild.iconURL({ dynamic: true }),
        });

      message.reply({ embeds: [embed] });
    }
  } else {
    const channels = await schema
      .findOne({ guildId: message.guildId }, { _id: 0, __v: 0, guildId: 0 })
      .exec();
    if (!channels) return;

    const convertedData = Object.entries(channels).filter((arr) =>
      arr.includes("_doc")
    );
    const conData = JSON.stringify(convertedData[0])
      .replace('["_doc",', "")
      .replace("]", "");
    const data = JSON.parse(conData);
    const check = Object.keys(data).filter(
      (key) => channels[key] == message.channel.id
    );

    switch (check.toString()) {
      case "tax":
        if (!channels.toggleTax) break;
        taxCalc(message);
        break;
      case "emoji":
        if (!channels.toggleEmoji) break;
        emojiDownloader(message);
        break;
      case "short":
        if (!channels.toggleShort) break;
        shortURL(message);
        break;
      case "tiktok":
        if (!channels.toggleTikTok) break;
        tiktokDownload(message);
        break;
    }
  }
});

client.login(process.env.TOKEN);
