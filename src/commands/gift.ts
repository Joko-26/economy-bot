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
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
    .setName("gift")
    .setDescription("Gift coins to another member")

    .addUserOption(option =>
        option
            .setName("member")
            .setDescription("The member you want to gift coins")
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("coins")
            .setDescription("The amount of coins you want to gift")
            .setMinValue(0)
    )

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId))
    const member = interaction.user.id

    if (state.member[member] === undefined) {
        state.member[member] = 0
    }

    const otherMemberObj = interaction.options.getUser("member")
    const otherMember = otherMemberObj.id

    if (state.member[otherMember] === undefined) {
        state.member[otherMember] = 0
    }

    const amount = interaction.options.getInteger("coins")
    const coins = state.member[member]

    if (amount > coins) {
        const embed = new EmbedBuilder()
            .setTitle("Not enough coins")
            .setDescription(`You dont have enought coins\n (you wanted to gift **${amount}** but only have **${coins}** coins)`)
            .setColor(0xff1100)
        
        return interaction.reply({embeds: [embed], flags: "Ephemeral"})
    }

    state.member[member] -= amount
    state.member[String(otherMember)] += amount
    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
        .setTitle("Gift")
        .setDescription(`${interaction.user} send <@${otherMember}> **${amount}** coins as a gift.`)
        .setColor(0x00ff88)

    return interaction.reply({embeds: [embed]})
}   