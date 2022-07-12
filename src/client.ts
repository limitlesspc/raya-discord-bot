import { Client, Options } from 'discord.js';

import './env';

const { NAME, DISCORD_TOKEN } = process.env;
console.log(`⏳ ${NAME} is starting...`);
console.time(NAME);

const MESSAGE_CONTENT = 1 << 15;

const client = new Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MEMBERS',
    'DIRECT_MESSAGES',
    MESSAGE_CONTENT
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
export default client;

client
  .once('ready', () => {
    console.timeEnd(NAME);
    console.log(`✅ ${NAME} is ready!`);
  })
  .login(DISCORD_TOKEN);
