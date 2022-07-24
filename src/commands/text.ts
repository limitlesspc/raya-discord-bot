import { getText } from 'limitless/api/y7';
import command from 'limitless/discord/command';

export default command(
  {
    desc: 'Sends text from the best website on the internet: yyyyyyy.info',
    options: {}
  },
  async i => {
    try {
      const src = await getText();
      return await i.reply(src);
    } catch {
      return i.reply('So sad, looks like yyyyyyy.info is down ):');
    }
  }
);
