import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  EmbedBuilder,
  Guild,
  embedLength,
  Integration,
} from "discord.js";
import { getGuildState, saveGuildState } from "./stateManager";
import { stat } from "fs";

export async function handleButton(interaction: ButtonInteraction) {
  const state = getGuildState(String(interaction.guildId));

  const rpsElements = {
    scissor: "✂️",
    paper: "📃",
    rock: "🪨",
  };

  if (interaction.customId.split("*")[0] === "join-RPS") {
    const member = interaction.user.id;

    if (state.member[member] === undefined) {
      state.member[member] = 0;
    }

    if (state.member[member] < parseInt(interaction.customId.split("*")[2])) {
      const embed = new EmbedBuilder()
        .setTitle("Not enough coins")
        .setDescription(
          `You dont have enought coins\n (you wanted to bet ${
            interaction.customId.split("*")[2]
          } but only have ${state.member[member]} coins)`
        )
        .setColor(0xff1100);

      return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }
    const bet = parseInt(interaction.customId.split("*")[2])
    state.member[member] -= bet

    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
      .setTitle("Rock Paper Scissors")
      .setDescription("choose your element:")
      .setColor(0xfbff00);

    const rockButton = new ButtonBuilder()
      .setCustomId(`RPS*rock*${interaction.customId.split("*")[1]}*${interaction.customId.split("*")[2]}`)
      .setLabel("🪨")
      .setStyle(ButtonStyle.Primary);
    const paperButton = new ButtonBuilder()
      .setCustomId(`RPS*paper*${interaction.customId.split("*")[1]}*${interaction.customId.split("*")[2]}`)
      .setLabel("📃")
      .setStyle(ButtonStyle.Danger);
    const scissorButton = new ButtonBuilder()
      .setCustomId(`RPS*scissor*${interaction.customId.split("*")[1]}*${interaction.customId.split("*")[2]}`)
      .setLabel("✂️")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      rockButton,
      paperButton,
      scissorButton,
    ]);

    return interaction.reply({
      embeds: [embed],
      components: [row],
      flags: "Ephemeral",
    });
  }

  if (interaction.customId.split("*")[0] === "RPS") {
    console.log("run")
    const matchId = interaction.customId.split("*")[2];
    const move = interaction.customId.split("*")[1];
    const member = interaction.user.id;

    if (!state.rpsMatches) state.rpsMatches = {};
    if (!state.rpsMatches[matchId]) state.rpsMatches[matchId] = {};

    state.rpsMatches[matchId][member] = move;
    saveGuildState(String(interaction.guildId));

    const winsAgainst = {
      rock: "scissor",
      paper: "rock",
      scissors: "paper",
    } as const;

    const embed = new EmbedBuilder()
      .setTitle("Your element")
      .setDescription(
        `You choose ${
          rpsElements[interaction.customId.split("*")[1]]
        } as your element for your this round of rock paper scissors`
      )
      .setColor(0xfbff00);

    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    
    if (Object.keys(state.rpsMatches[interaction.customId.split("*")[2]]).length == 2) {
      
      const moves = state.rpsMatches[interaction.customId.split("*")[2]]
      const players = Object.keys(moves)
      const elements = Object.values(moves)
      const playerOneMove = elements[0]
      const playerTwoMove = elements[1]
      console.log(`${playerOneMove} ${playerTwoMove}`)

      console.log(interaction.customId.split("*")[3])
      const bet = parseInt(interaction.customId.split("*")[3])

      if (playerOneMove == playerTwoMove) {
        state.member[players[0]] += bet
        state.member[players[1]] += bet

        delete state.rpsMatches[interaction.customId.split("*")[2]]

        saveGuildState(String(interaction.guildId))

        const embed = new EmbedBuilder()
          .setTitle("Rock-Paper-Scissor result")
          .setDescription(`<@${players[0]}> and <@${players[1]}> tied with ${playerOneMove} they now get their bet back.`)
          .setColor(0x001eff)

        await interaction.followUp({embeds: [embed]})
      } else {
          if (winsAgainst[playerOneMove] == playerTwoMove) {
            state.member[players[0]] += bet * 2

            delete state.rpsMatches[interaction.customId.split("*")[2]]

            saveGuildState(String(interaction.guildId))

            const embed = new EmbedBuilder()
              .setTitle("Rock-Paper-Scissor result")
              .setDescription(`<@${players[0]}> wins with ${playerOneMove} against ${playerTwoMove} and now gets ${bet * 2} coins`)
              .setColor(0x001eff)

            await interaction.followUp({embeds: [embed]})
          } 
          if (winsAgainst[playerTwoMove] == playerOneMove) {
            state.member[players[1]] += bet * 2

            delete state.rpsMatches[interaction.customId.split("*")[2]]

            saveGuildState(String(interaction.guildId))

            const embed = new EmbedBuilder()
              .setTitle("Rock-Paper-Scissor result")
              .setDescription(`<@${players[1]}> wins with ${playerTwoMove} against ${playerOneMove} and now gets ${bet * 2} coins`)
              .setColor(0x001eff)

            await interaction.followUp({embeds: [embed]})
          }
      }
        
    }
  }
}
