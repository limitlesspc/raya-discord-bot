import { arch, memoryUsage, platform, uptime, versions } from 'node:process';
import { cpus, freemem, totalmem } from 'node:os';
import { MessageEmbed, version } from 'discord.js';

import command from '$services/command';

export default command(
  {
    desc: "Gets information on the bot's environment",
    options: {}
  },
  i => {
    const { node, v8 } = versions;
    const embed = new MessageEmbed()
      .setTitle('Status')
      .setColor(0x00ae86)
      .addField('⬢ Node.js', node)
      .addField('V8', v8)
      .addField('Discord.js', `v${version}`)
      .addField('Platform', platform)
      .addField('💻 Architecture', arch)
      .addField('Uptime', `${Math.floor(uptime() / 60)} min`)
      .addField(
        'Memory',
        `${Math.floor(memoryUsage().heapUsed / 1024 / 1024)} MB`
      )
      .addField('Total OS Memory', `${Math.floor(totalmem() / 1024 / 1024)} MB`)
      .addField('Free OS Memory', `${Math.floor(freemem() / 1024 / 1024)} MB`)
      .addField('Logical CPU Cores', `${cpus().length}`);
    return i.reply({ embeds: [embed] });
  }
);
