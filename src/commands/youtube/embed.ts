import { MessageEmbed } from 'discord.js';

export const createEmbed = () =>
  new MessageEmbed()
    .setColor('#ff0000')
    .setFooter({
      text: 'YouTube',
      iconURL:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png'
    });
