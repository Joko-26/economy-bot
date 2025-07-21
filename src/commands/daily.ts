import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Guild,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";
import { timeSplitter, getFormattedDate, isBeforeYesterday } from "../utilities";

export const data = new SlashCommandBuilder()
    .setName("dailycoins")
    .setDescription("Get some coins every day")

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId))

    const member = interaction.user.id;

    
    if (state.member[member] === undefined) {
        state.member[member] = 0
    }

    

    const lastClaimedstr = state.daily?.[member];

    if (lastClaimedstr === undefined) {
        state.daily[member] = getFormattedDate()
        state.member[member] += 10
        saveGuildState(String(interaction.guildId))
        const embed = new EmbedBuilder()
            .setTitle("You claimed your daily coins")
            .setDescription("You claimed your daily 10 coins")
            .setColor(0x00ff88)

        return interaction.reply({embeds: [embed], flags:"Ephemeral"})
    }

    if (lastClaimedstr && !isBeforeYesterday(lastClaimedstr)) {
        saveGuildState(String(interaction.guildId))

        const embed = new EmbedBuilder()
            .setTitle("You already claimed your daily coins")
            .setDescription("You can claim your daily coins again tommorow")
            .setColor(0xff1100)

        return interaction.reply({embeds: [embed], flags:"Ephemeral"})
    }
    
    if (lastClaimedstr && isBeforeYesterday(lastClaimedstr)) {
        state.member[member] += 10
        state.daily[member] = getFormattedDate()
        saveGuildState(String(interaction.guildId))

        const embed = new EmbedBuilder()
            .setTitle("You claimed your daily coins")
            .setDescription("You claimed your daily 10 coins")
            .setColor(0xfbff00)

        return interaction.reply({embeds: [embed], flags:"Ephemeral"})
    }
}