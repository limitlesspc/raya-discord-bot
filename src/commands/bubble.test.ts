import test from 'ava';
import type { SpeechBubble } from '@prisma/client';

import prisma from '$services/prisma';

test('bubble', async t => {
  const [bubble] = await prisma.$queryRaw<[SpeechBubble]>`SELECT *
    FROM SpeechBubble
    ORDER BY RAND()
    LIMIT 1;`;
  t.log(bubble);
  t.pass();
});
