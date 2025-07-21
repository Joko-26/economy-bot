import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  User,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";
import { getRandomInt } from "../utilities";

export const data = new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("flip a coin and bet money")

  .addStringOption((option) =>
    option
      .setName("selection")
      .setDescription("choose the side for the coinflip")
      .setRequired(true)
      .addChoices(
        { name: "Heads", value: "1" },
        { name: "Tails", value: "0" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("amount")
      .setDescription("choose the amount you want to bet all is also valid")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const state = getGuildState(String(interaction.guildId));

  const selection = interaction.options.getString("selection", true);
  const amount = interaction.options.getString("amount", true);

    const sides = {
        0: "heads", 
        1: "tails"
    }

  const member = interaction.user.id;

  if (state.member[member] === undefined) {
    state.member[member] = 0;
  }

  const memberMoney = state.member[member];

  let bet = 0

  if (amount == "all" || amount == "All") {
    bet = memberMoney
  } else {
    bet = parseInt(amount)
  }
  
  if (memberMoney < bet) {
    const embed = new EmbedBuilder()
      .setTitle("Not enought money")
      .setDescription(
        `You dont have enought money\n (you wanted to bet **${amount}** but you only have **${memberMoney})**`
      )
      .setColor(0xff1100);

    return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }

  if (memberMoney == 0) {
    const embed = new EmbedBuilder()
      .setTitle("No Money")
      .setDescription(
        `You dont have any money`
      )
      .setColor(0xff1100);

    return interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }

  state.member[member] -= bet
  const side = getRandomInt(0, 1)

  if (String(side) == selection) {
    state.member[member] += (bet * 2)



    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
      .setTitle(`You won`)
      .setDescription(
        `${interaction.user} bet **${bet}** on ${sides[selection]} at a coinflip and won, he now has ${state.member[member]} coins`
      )
      .setColor(0xff1100);

    return interaction.reply({ embeds: [embed]});
  } else {

    saveGuildState(String(interaction.guildId))

    const embed = new EmbedBuilder()
      .setTitle(`You lost`)
      .setDescription(
        `${interaction.user} bet **${bet}** on ${sides[selection]} but the coin landed on ${sides[side]}.`
      )
      .setColor(0xff1100);

    return interaction.reply({ embeds: [embed]});
  }

}
