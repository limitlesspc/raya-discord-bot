import owofy from 'owofy';

import command from '$services/command';

export default command(
  {
    desc: 'Owoifies a message',
    options: {
      message: {
        type: 'string',
        desc: 'The message to owoify'
      }
    }
  },
  async (i, { message }) => i.reply(owofy(message))
);
