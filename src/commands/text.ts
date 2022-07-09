import { getText } from '../api/y7';
import command from './command';

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
