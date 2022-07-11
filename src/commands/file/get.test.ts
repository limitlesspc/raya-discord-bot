import test from 'ava';

import { getRandomFile } from './get';

test('get random file', async t => {
  const file = await getRandomFile();
  t.truthy(file);
  t.log(`${file?.name}.${file?.extension}`);
});

test('get random image', async t => {
  const file = await getRandomFile('image');
  t.truthy(file);
  t.log(`${file?.name}.${file?.extension}`);
});

test('get random video', async t => {
  const file = await getRandomFile('video');
  t.truthy(file);
  t.log(`${file?.name}.${file?.extension}`);
});

test('get random audio', async t => {
  const file = await getRandomFile('audio');
  t.truthy(file);
  t.log(`${file?.name}.${file?.extension}`);
});
