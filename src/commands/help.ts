import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("List all available commands and their descriptions");

export async function execute(interaction: ChatInputCommandInteraction) {
  const helpEmbed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📖 All Commands")
    .setDescription("Here are all the available commands:")
    .addFields(
      {
        name: "`/balance`",
        value: "Check your current coin balance.",
        inline: false,
      },
      {
        name: "`/coinflip`",
        value: "Gamble your coins in a coin flip game.",
        inline: false,
      },
      {
        name: "`/dailycoins`",
        value: "Claim your daily reward of coins.",
        inline: false,
      },
      {
        name: "`/gift`",
        value: "Send coins to another user.",
        inline: false,
      },
      {
        name: "`/rockpaperscissors`",
        value: "Play rock-paper-scissors with another member for your betted coins.",
        inline: false,
      },
      {
        name: "`/leaderboard`",
        value: "View the richest users on the server.",
        inline: false,
      },
      {
        name: "`/guessword`",
        value: "Start a new Guess-The-Word game.",
        inline: false,
      },
      {
        name: "`/guess`",
        value: "Submit a guess for the current word challenge.",
        inline: false,
      }
    )
    .setFooter({ text: "Use these commands wisely and have fun!" })
    .setTimestamp();

  await interaction.reply({ embeds: [helpEmbed], flags: "Ephemeral"});
} 