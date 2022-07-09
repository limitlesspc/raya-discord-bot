import { REST } from '@discordjs/rest';
import { ApplicationCommandOptionType, Routes } from 'discord-api-types/v9';

import * as commandsData from './commands';
import type {
  Command,
  CommandGroups,
  CommandOptionType,
  Commands
} from './commands/command';

import './env';

const commandOptionTypeMap: Record<
  keyof CommandOptionType,
  ApplicationCommandOptionType
> = {
  int: ApplicationCommandOptionType.Integer,
  float: ApplicationCommandOptionType.Number,
  string: ApplicationCommandOptionType.String,
  user: ApplicationCommandOptionType.User,
  choice: ApplicationCommandOptionType.String
};

console.log('Commands registering...');
let buildCount = 0;

const { default: oddNameCommands, ...normalCommands } = commandsData;

const data = Object.entries({
  ...normalCommands,
  ...oddNameCommands
} as unknown as Commands | CommandGroups).map(([name, command]) =>
  typeof command.desc === 'string'
    ? build(name, command as Command)
    : typeof Object.values(command as Commands | CommandGroups)[0].desc ===
      'string'
    ? {
        name,
        description: name,
        options: Object.entries(command as Commands).map(([name, command]) => ({
          type: ApplicationCommandOptionType.Subcommand,
          ...build(name, command)
        }))
      }
    : {
        name,
        description: name,
        options: Object.entries(command as CommandGroups).map(
          ([name, command]) => ({
            type: ApplicationCommandOptionType.SubcommandGroup,
            name,
            description: name,
            options: Object.entries(command as Commands).map(
              ([name, command]) => ({
                type: ApplicationCommandOptionType.Subcommand,
                ...build(name, command)
              })
            )
          })
        )
      }
);

function build(name: string, { desc, options }: Command) {
  buildCount++;
  return {
    name,
    description: desc,
    options: Object.entries(options).map(
      ([
        name,
        { desc, type, min, max, optional, default: d, choices, autocomplete }
      ]) => ({
        name,
        type: commandOptionTypeMap[type],
        description: desc,
        min_value: min,
        max_value: max,
        required: !optional && d === undefined,
        choices:
          type === 'choice'
            ? Array.isArray(choices)
              ? choices.map(choice => ({
                  name: choice,
                  value: choice
                }))
              : Object.entries(choices || {}).map(([name, description]) => ({
                  name,
                  description,
                  value: name
                }))
            : undefined,
        autocomplete: !!autocomplete
      })
    )
  };
}

const rest = new REST({ version: '9' }).setToken(
  process.env.DISCORD_TOKEN || ''
);

rest
  .put(Routes.applicationCommands(process.env.DISCORD_APP_ID || ''), {
    body: data
  })
  .then(() => console.log(buildCount, 'commands registered'))
  .catch(console.error);
