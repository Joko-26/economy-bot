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
import { shuffleArray } from "../utilities";

export const data = new SlashCommandBuilder()
    .setName("guessword")
    .setDescription("Start a game of guess the word")

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId))

    if (state.currentWord) {

      const embed = new EmbedBuilder()
        .setTitle("Current Guess-The-Word game")
        .setDescription(`There is a ongoing Guess-The-Word game \n The hidden word is **${state.currentGuessedWord}** \n _Guess with \`/guess\`_`)
        .setColor(0x00ff88)

      return interaction.reply({embeds: [embed]})

    }

    const word = shuffleArray(state.words).pop()

    state.currentWord = word

    const hiddenWord = word?.split("").map(() => "▮").join(" ")

    state.currentGuessedWord = hiddenWord

    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
      .setTitle("new Guess-The-Word game")
      .setDescription(`A new Guess-The-Word game started\n The hidden word is **${hiddenWord}** \n _Guess with \`/guess\`_`)
      .setColor(0x00ff88)

    await interaction.reply({embeds: [embed]})

}