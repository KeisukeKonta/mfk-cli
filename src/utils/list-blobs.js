import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { parse } from 'https://deno.land/x/xml/mod.ts';

const { ACCOUNT, CONTAINER, TOKEN } = config();

export default async function listBlobs() {
  const URI =
    `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}?restype=container&comp=list`;
  const response = await fetch(`${URI}${TOKEN.replace('?', '&')}`);
  const text = await response.text();
  const xml = parse(text);
  const blobs = xml.EnumerationResults.Blobs.Blob.map((blob) => blob.Name);
  console.log(blobs);
}
