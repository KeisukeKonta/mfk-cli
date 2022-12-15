import MFKBlob from '../interfaces/mfk-blob.ts';
import getBlobUri from './get-blob-uri.ts';

export default async function getBlob(blob: MFKBlob) {
  const { macAddress, year, month, date, hour } = blob;
  const [yyyy, [mm, dd, hh]] = [
    year,
    [month, date, hour].map((n) => String(n).padStart(2, '0')),
  ];
  const file =
    `${macAddress}/urn_X-topcon_machine_${macAddress}_${yyyy}-${mm}-${dd}T${hh}_00_00+09_00_Asia-Tokyo.csv`;
  const URI = getBlobUri(file);
  const response = await fetch(`${URI}`);
  const text = await response.text();
  await Deno.writeTextFile(file.split('/')[1], text);
}
