import { ColorResolvable, MessageEmbed } from 'discord.js';

import { incCount } from '$services/users';
import command from '$services/command';
import { Fetcher } from '$services/openapi';
import type { paths } from '$openapi/waifu';

const fetcher = Fetcher.for<paths>();
fetcher.configure({
  baseUrl: 'https://api.waifu.im'
});

const getRandom = fetcher.path('/random/').method('get').create();

export default command(
  {
    desc: 'Sends a random waifu.im image',
    options: {
      option: {
        type: 'choice',
        desc: 'Additional query option',
        choices: {
          gif: 'Get a GIF instead of a normal image',
          nsfw: 'Get a naughty image'
        },
        optional: true
      }
    }
  },
  async (i, { option }) => {
    if (option === 'nsfw' && i.channel?.type === 'GUILD_TEXT' && i.channel.nsfw)
      return i.reply("This isn't a nsfw channel you cheeky boi");

    const { data } = await getRandom({
      gif: option === 'gif',
      is_nsfw: option === 'nsfw' ? 'true' : 'false'
    });
    const image = data.images[0];
    console.log(data);
    if (!image) throw new Error('No waifu found');

    const embed = new MessageEmbed()
      .setTitle(image.tags.map(t => t.name).join(', '))
      .setURL(image.url)
      .setDescription(image.tags.map(t => t.description).join(', '))
      .setColor(image.dominant_color as ColorResolvable)
      .setImage(image.url)
      .setFooter({
        text: 'Powered by waifu.im',
        iconURL: 'https://waifu.im/favicon.ico'
      })
      .setTimestamp(new Date(image.uploaded_at));
    if (image.source)
      embed.setAuthor({
        name: image.source,
        url: image.source
      });

    await i.reply({ embeds: [embed], ephemeral: true });
    return incCount(i.user.id, 'weeb');
  }
);
