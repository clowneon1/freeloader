const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.login(
  "MTIxMTYzMDM1MDQwOTc5NzY3Mg.GneNC9.U_-k_o73nfUpHv9fF8qKCILCK9QWFyoU4L2UL4"
);
