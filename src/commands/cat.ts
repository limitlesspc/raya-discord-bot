import { fetch } from 'undici';

import command from './command';

type Response = {
  breeds: string[];
  id: string;
  url: string;
  width: number;
  height: number;
}[];

export default command(
  {
    desc: 'Sends a random cat',
    options: {}
  },
  async i => {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = (await response.json()) as Response;
    const [cat] = data;
    if (!cat) throw new Error('No cat found');
    return i.reply(cat.url);
  }
);
