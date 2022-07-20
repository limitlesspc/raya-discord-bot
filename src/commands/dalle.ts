import fetch from 'node-fetch';

import command from '$services/command';

interface Response {
  object: 'credit_summary';
  next_grant_ts: number;
  aggregate_credits: number;
  breakdown: {
    free: number;
    grant_beta_tester: number;
  };
}

export default command(
  {
    desc: 'For now, just returns the number of free credits left',
    options: {}
  },
  async i => {
    const response = await fetch(
      'https://labs.openai.com/api/labs/billing/credit_summary',
      {
        headers: {
          Authorization: `Bearer ${process.env.DALLE2_TOKEN}`
        }
      }
    );
    const { aggregate_credits }: Response = await response.json();
    return i.reply(`${aggregate_credits} free credits left`);
  }
);
