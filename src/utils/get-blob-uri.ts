import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { ACCOUNT, CONTAINER, TOKEN } = config();

export default function getBlobUri(file) {
  const URI = `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}`;
  return `${URI}/${file}${TOKEN}`;
}
