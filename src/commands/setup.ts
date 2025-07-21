import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Setup the bot")

  .addChannelOption((option) => 
    option
        .setName("channel")
        .setDescription("The cannel you want the bot to post messages to givaways etc. in")
        .setRequired(true)
  )

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId))

    const channel = interaction.options.getChannel("channel", true);

    state.channel = String(channel.id)

    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
    .setTitle("setup complete")
    .setDescription(`You set up the bot with:\n The channel ${channel}`)
    .setColor(0x00ff88)
    
    return interaction.reply({
        embeds: [embed],
        flags: "Ephemeral"
    })
}