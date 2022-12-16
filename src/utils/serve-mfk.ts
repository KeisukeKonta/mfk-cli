import { readJson } from 'https://deno.land/x/jsonfile/mod.ts';
import { WebSocketServer } from 'https://deno.land/x/websocket/mod.ts';

export default async function serveMfk(file: string, port: number) {
  const mfkData = await readJson(file);
  const server = new WebSocketServer(port || 8000);
  server.on('connection', () => {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % mfkData.length;
      server.clients.forEach(async (client) => {
        client.send(JSON.stringify(mfkData[i]));
        const date = new Date(mfkData[i].at);
        const time = new TextEncoder().encode(
          `\r${date.toLocaleString()}.${date.getMilliseconds()}`,
        );
        await Deno.writeAll(Deno.stdout, time);
      });
    }, 100);
  });
}
