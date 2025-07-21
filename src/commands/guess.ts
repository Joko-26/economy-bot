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
    .setName("guess")
    .setDescription("Guess a Letter of the word from the current Guess-The-Word game ")

    .addStringOption((option) =>
        option
            .setName("letter")
            .setDescription("The letter you want to guess (use lowercase letters)")
            .setMinLength(1)
            .setMaxLength(1)
            .setRequired(true)
    )

export async function execute(interaction:ChatInputCommandInteraction) {
    const state = getGuildState(String(interaction.guildId))

    if (!state.currentWord) {
        const embed = new EmbedBuilder()
            .setTitle("No Guess-The-Word game")
            .setDescription(`There is no ongaing guess the word game\n start a new one with \`/guessword\``)
            .setColor(0xff1100)

        return interaction.reply({embeds: [embed]})
    }

    const guessedLetter = interaction.options.getString("letter", true)

    const wordArray = state.currentWord.split("")
    let hiddenWordArray = state.currentGuessedWord.split(" ")
    let lettersGuessed = 0

    let i = 0
    for (const letter of wordArray){
        if (letter == guessedLetter && hiddenWordArray[i] == "▮") {
            hiddenWordArray[i] = letter
            lettersGuessed ++
        }
        i ++
    }
    const hiddenWord = hiddenWordArray.join(" ")

    state.currentGuessedWord = hiddenWord

    if (lettersGuessed == 0) {
        saveGuildState(String(interaction.guildId))
        const embed = new EmbedBuilder()
            .setTitle("Letter not in hidden word")
            .setDescription(`The letter ${guessedLetter} guessed by ${interaction.user} was not in the Hidden word or was guessed before`)
            .setColor(0xff1100)

        return interaction.reply({embeds: [embed]})
    }

    const member = interaction.user.id

    if (state.member[member] === undefined) {
        state.member[member] = 0
    }

    if (!hiddenWord.includes("▮")) {
        state.member[member] += 25

        state.currentWord = ""
        state.currentGuessedWord = ""

        saveGuildState(String(interaction.guildId))

        const embed = new EmbedBuilder()
            .setTitle("Word was guessed")
            .setDescription(`${interaction.user} guessed the word **${state.currentWord}** he now gets **25 coins**`)
            .setColor(0x001eff)

        return interaction.reply({embeds: [embed]})
    }

    state.member[member] += 5 * lettersGuessed

    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
        .setTitle("Letter is in hidden word")
        .setDescription(`The letter ${guessedLetter} guessed by ${interaction.user} was ${lettersGuessed} times in the hidden word he now gets **${5 * lettersGuessed} coins**\n\n the hidden word now is **${state.currentGuessedWord}**`)
        .setColor(0x001eff)

    await interaction.reply({embeds: [embed]})
        
}