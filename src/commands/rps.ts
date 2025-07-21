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
    .setName("rockpaperscissors")
    .setDescription("Play with another server member for the bet money")

    .addIntegerOption(option =>
        option
            .setName("bet")
            .setDescription("The amount of coins you want to bet")
            .setMinValue(0)
            .setRequired(true)
    )

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId))
    const member = interaction.user.id

    const amount = interaction.options.getInteger("bet", true)
    

    if (state.member[member] === undefined) {
        state.member[member] = 0
    }

    const coins = state.member[member]

    if (amount > coins) {
        const embed = new EmbedBuilder()
            .setTitle("Not enough coins")
            .setDescription(`You dont have enought coins\n (you wanted to bet ${amount} but only have ${coins} coins)`)
            .setColor(0xff1100)
        
        return interaction.reply({embeds: [embed], flags: "Ephemeral"})
    }

    state.rpsMatches[member] = {}
    state.member[member] -= amount

    saveGuildState(String(interaction.guildId))


    const joinButton = new ButtonBuilder()
        .setCustomId(`join-RPS*${member}*${amount}`)
        .setLabel(`Play`)
        .setStyle(ButtonStyle.Success)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton);

    const embed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors")
        .setDescription(`${interaction.user} has started a new round of Rock Paper Scissor with a Bet of **${amount} coins**\n _if you join him you have to bet the same amount_`)
        .setColor(0x00ff88)

    await interaction.reply({embeds:[embed], components: [row]})

        const playEmbed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors")
        .setDescription("choose your element:\n _youll get notified when another person joins and the winner is announced_")
        .setColor(0xfbff00)

    const rockButton = new ButtonBuilder()
        .setCustomId(`RPS*rock*${member}*${amount}`)
        .setLabel("🪨")
        .setStyle(ButtonStyle.Primary)
    const paperButton = new ButtonBuilder()
        .setCustomId(`RPS*paper*${member}*${amount}`)
        .setLabel("📃")
        .setStyle(ButtonStyle.Danger)
    const scissorButton = new ButtonBuilder()
        .setCustomId(`RPS*scissor*${member}*${amount}`)
        .setLabel("✂️")
        .setStyle(ButtonStyle.Success)

    const playRow = new ActionRowBuilder<ButtonBuilder>().addComponents([rockButton, paperButton, scissorButton])

    return interaction.followUp({embeds: [playEmbed], components:[playRow], flags:"Ephemeral"})
}
