import { parse } from 'https://deno.land/std@0.168.0/flags/mod.ts';
import listBlobs from './utils/list-blobs.js';

const cmd = parse(Deno.args)._[0];

switch (cmd) {
  // List blobs
  case 'list':
    listBlobs();
    break;
  // Invalid command
  default:
    throw `Invalid command: ${parse(Deno.args)._.join(' ')}`;
}
