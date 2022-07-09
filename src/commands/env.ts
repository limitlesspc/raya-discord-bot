import { arch, platform, versions } from 'node:process';
import { MessageEmbed } from 'discord.js';

import command from '$services/command';

export default command(
  {
    desc: "Gets information on the bot's environment",
    options: {}
  },
  i => {
    const { node, v8 } = versions;
    const embed = new MessageEmbed()
      .setTitle('Environment')
      .setColor(0x00ae86)
      .addField('⬢ Node.js', node)
      .addField('V8', v8)
      .addField('Platform', platform)
      .addField('💻 Architecture', arch);
    return i.reply({ embeds: [embed] });
  }
);
