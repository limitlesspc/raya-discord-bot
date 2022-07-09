import { Client, Options } from 'discord.js';

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
export default client;
