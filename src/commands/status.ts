import { arch, memoryUsage, platform, uptime, versions } from 'node:process';
import { cpus, freemem, totalmem } from 'node:os';
import { EmbedBuilder, version } from 'discord.js';
import command from '@limitlesspc/limitless/discord/command';

export default command(
  {
    desc: "Gets information on the bot's environment",
    options: {}
  },
  i => {
    const { node, v8 } = versions;
    const embed = new EmbedBuilder()
      .setTitle('Status')
      .setColor('#3AA65B')
      .addFields(
        { name: '⬢ Node.js', value: node },
        { name: 'V8', value: v8 },
        { name: 'Discord.js', value: `v${version}` },
        { name: 'Platform', value: platform },
        { name: '💻 Architecture', value: arch },
        { name: '⏱ Uptime', value: `${Math.floor(uptime() / 60)} min` },
        {
          name: '💾 Memory Used',
          value: `${Math.floor(memoryUsage().heapUsed / 1024 / 1024)} MB`
        },
        {
          name: '💾 Memory Total',
          value: `${Math.floor(memoryUsage().heapTotal / 1024 / 1024)} MB`
        },
        {
          name: '💾 Total OS Memory',
          value: `${Math.floor(totalmem() / 1024 / 1024)} MB`
        },
        {
          name: '💾 Free OS Memory',
          value: `${Math.floor(freemem() / 1024 / 1024)} MB`
        },
        { name: 'Logical CPU Cores', value: `${cpus().length} cores` }
      );
    return i.reply({ embeds: [embed] });
  }
);
