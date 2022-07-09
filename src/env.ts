import { join } from 'node:path';
import { config } from 'dotenv';
import 'dotenv/config';

if (process.env.PROD)
  config({ path: join(__dirname, '../.env.prod'), override: true });
