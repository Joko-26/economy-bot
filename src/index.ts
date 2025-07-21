import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
  Events,
  Guild,
} from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import states from "./States.json"
import { getGuildState, saveGuildState, loadStates, deleteState } from "./stateManager"
import { handleButton } from "./buttonHandler";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMembers"],
});

client.once("ready", () => {
  for (const id in states) {
    deployCommands({ guildId: id });
  }
  console.log("Discord bot is ready! 🤖");
});

client.on(Events.GuildCreate, async (guild) => {
  console.log("guild entered")
  getGuildState(guild.id)
  await deployCommands({ guildId: guild.id });
});

client.on(Events.GuildDelete, async (guild) => {
  deleteState(guild.id)
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    handleButton(interaction)
  }
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);