import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';

const { ACCOUNT, CONTAINER, TOKEN } = config();

export default function getBlobUri(file) {
  const URI = `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}`;
  return `${URI}/${file}${TOKEN}`;
}
