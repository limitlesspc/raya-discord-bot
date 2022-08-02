import { getText } from '@limitlesspc/limitless/api/y7';
import command from '@limitlesspc/limitless/discord/command';

export default command(
  {
    desc: 'Sends text from the best website on the internet: yyyyyyy.info',
    options: {}
  },
  async i => {
    await i.deferReply();
    try {
      const src = await getText();
      return await i.editReply(src);
    } catch {
      return i.editReply('So sad, looks like yyyyyyy.info is down ):');
    }
  }
);
