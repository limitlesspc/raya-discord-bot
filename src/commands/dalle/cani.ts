import command from '@limitlesspc/limitless/discord/command';
import { getLastUsedAt, WAIT_MILLIS } from './shared';

export default command(
  {
    desc: 'Determines the amount of time left until you can generate new images',
    options: {}
  },
  async i => {
    if (i.user.bot) return i.reply('Bots cannot use DALL·E 2 generate');
    if (i.user.id === process.env.OWNER_ID)
      return i.reply(
        'You created this bot, so you can always generate new images'
      );

    const lastDalleAt = await getLastUsedAt(i.user.id);
    if (!lastDalleAt) return i.reply('You can generate new images now!');

    const now = new Date().getTime();
    const diff = now - lastDalleAt.getTime();
    if (diff >= WAIT_MILLIS) return i.reply('You can generate new images now!');

    const timeLeft = WAIT_MILLIS - diff;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return i.reply(
      `You can generate new images in ${hours}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  }
);
