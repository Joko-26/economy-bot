import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Guild,
  embedLength,
  AttachmentBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";
import { generateLeaderboard } from "../leaderboardGenerator";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Shows the leaderboard for the current server");

export async function execute(interaction: ChatInputCommandInteraction) {
  const state = getGuildState(String(interaction.guildId));

  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply();
  }

  for (const key in state.member) {
    if (state.member[key] === undefined) {
      state.member[key] = 0;
    }
  }

  const members = state.member;

  const leaderboardEntries = await Promise.all(
    Object.entries(members).map(async ([username, coins]) => {
      const member = await interaction.guild?.members
        .fetch(username)
        .catch(() => null);
      const avatarURL = member
        ? member.user.displayAvatarURL({ extension: 'png', size: 128 })
        : "https://cdn.discordapp.com/embed/avatars/0.png";
      return {
        username: member ? `${member.user.username}` : "unknown",
        avatarURL,
        coins: Number(coins),
      };
    })
  );

  leaderboardEntries.sort((a, b) => Number(b.coins) - Number(a.coins));

  const buffer = await generateLeaderboard(leaderboardEntries);
  const attachment = new AttachmentBuilder(buffer, { name: "leaderboard.png" });

  return interaction.editReply({ files: [attachment] });
}

async function getAvatarUrlByUsername(
  interaction: ChatInputCommandInteraction,
  username: string
): Promise<string | null> {
  console.log("get user pfp");
  const guild = interaction.guild;
  if (!guild) return null;
  await guild.members.fetch();
  const member = guild.members.cache.find((m) => m.user.username === username);
  if (!member) {
    return null;
  }
  return member.user.displayAvatarURL();
}
