import {
  AutocompleteInteraction,
  Client,
  CommandInteraction,
  MessageEmbed,
  Options
} from 'discord.js';

import * as rawCommands from './commands';
import type {
  Command,
  CommandGroups,
  Commands,
  OptionValue
} from './commands/command';

import './env';

const { NAME, DISCORD_TOKEN } = process.env;
console.log(`⏳ ${NAME} is starting...`);
console.time(NAME);

const client = new Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MEMBERS',
    'DIRECT_MESSAGES'
  ],
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    GuildEmojiManager: 0,
    GuildMemberManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    MessageManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: 0,
    VoiceStateManager: 0
  })
});

const { default: oddNameCommands = {}, ...normalCommands } = rawCommands;
const commands = Object.fromEntries(
  Object.entries({
    ...normalCommands,
    ...oddNameCommands
  } as unknown as Commands | CommandGroups).map(([name, command]) => [
    name,
    normalize(command)
  ])
);
function normalize(
  command: Command | Commands | CommandGroups
): Command | Commands | CommandGroups {
  if (typeof command.desc === 'string') return command as Command;

  const { default: oddNameCommands = {}, ...normalCommands } =
    command as unknown as Commands | CommandGroups;
  return Object.fromEntries(
    Object.entries({ ...oddNameCommands, ...normalCommands }).map(
      ([subName, subCommand]) => [
        subName,
        normalize(subCommand as Command | Commands) as Command
      ]
    )
  );
}

function getCommand(
  i: CommandInteraction | AutocompleteInteraction
): Command | void {
  const command = commands[i.commandName];
  if (!command) return;

  const subGroupName = i.options.getSubcommandGroup(false);
  if (subGroupName) {
    const subGroup = (command as CommandGroups)[subGroupName];
    if (!subGroup) return;

    const subName = i.options.getSubcommand();
    const subCommand = subGroup[subName];
    return subCommand;
  }

  const subName = i.options.getSubcommand(false);
  if (subName) {
    const subCommand = (command as Commands)[subName];
    return subCommand;
  }

  return command as Command;
}

client
  .on('interactionCreate', async i => {
    if (i.isCommand()) {
      const command = getCommand(i);
      if (!command) return;

      const { options, handler } = command;
      try {
        return handler(
          i,
          Object.fromEntries(
            Object.entries(options).map(([name, { type, default: d }]) => {
              let value: OptionValue | null;
              switch (type) {
                case 'int':
                  value = i.options.getInteger(name);
                  break;
                case 'float':
                  value = i.options.getNumber(name);
                  break;
                case 'string':
                  value = i.options.getString(name);
                  break;
                case 'user':
                  value = i.options.getUser(name);
                  break;
                case 'choice':
                  value = i.options.getString(name);
                  break;
              }
              return [
                name,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                (value ?? d)!
              ];
            })
          )
        );
      } catch (error) {
        const name = [
          i.commandName,
          i.options.getSubcommandGroup(),
          i.options.getSubcommand()
        ]
          .filter(Boolean)
          .join(' ');
        console.error(`Error while running command '${name}':`, error);
        if (error instanceof Error)
          return i.reply({
            embeds: [
              new MessageEmbed()
                .setColor('RED')
                .setTitle('Error')
                .setDescription(error.message)
                .setTimestamp()
            ],
            ephemeral: true
          });
      }
    }
    if (i.isAutocomplete()) {
      const command = getCommand(i);
      if (!command) return;

      const handleAutocomplete =
        command.options[i.options.getFocused()]?.autocomplete;
      if (!handleAutocomplete) return;
      const value = i.options.getFocused();
      const options = await handleAutocomplete(value);
      return i.respond(options.map(o => ({ name: o, value: o })));
    }
  })
  .on('interactionError', console.error)
  .once('ready', () => {
    console.timeEnd(NAME);
    console.log(`✅ ${NAME} is ready!`);
  })
  .login(DISCORD_TOKEN);
