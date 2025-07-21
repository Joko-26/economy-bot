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
    .setName("balance")
    .setDescription("Check your balance")

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId));
    const member = interaction.user.id

    if (state.member[member] === undefined) {
        state.member[member] = 0
    }
    
    saveGuildState(String(interaction.guildId))
    const embed = new EmbedBuilder()
        .setTitle("Balance")
        .setDescription(`Your balance is **${state.member[member]}**`)
        .setColor(0xfbff00)
    
    return interaction.reply({embeds: [embed], flags: "Ephemeral"})
}