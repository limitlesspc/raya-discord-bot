import { join } from 'node:path';
import { config } from 'dotenv';
import 'dotenv/config';

if (process.env.NODE_ENV === 'production')
  config({ path: join(__dirname, '../.env.prod'), override: true });
