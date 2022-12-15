import { parse } from 'https://deno.land/std@0.168.0/flags/mod.ts';
import MFKBlob from './interfaces/mfk-blob.ts';
import getBlob from './utils/get-blob.ts';
import listBlobs from './utils/list-blobs.ts';

const cmd = parse(Deno.args)._[0];

switch (cmd) {
  // List blobs
  case 'list': {
    const macAddress = parse(Deno.args).M;
    await listBlobs(macAddress);
    break;
  }
  // Get a blob
  case 'get': {
    const opt = parse(Deno.args);
    ['M', 'y', 'm', 'd', 'h'].forEach((o) => {
      const type = o == 'M' ? 'string' : 'number';
      if (!opt[o]) {
        throw `No option: -${o}`;
      } else if (typeof opt[o] !== type) {
        throw `Invalid option: -${o} ${opt[o]}\nIt has to be a ${type}.`;
      }
    });
    const blob: MFKBlob = {
      macAddress: opt.M,
      year: opt.y,
      month: opt.m,
      date: opt.d,
      hour: opt.h,
    };
    await getBlob(blob);
    break;
  }
  // Invalid command
  default:
    throw `Invalid command: ${parse(Deno.args)._.join(' ')}`;
}
