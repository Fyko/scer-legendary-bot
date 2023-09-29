import figlet from "figlet";

const server = Bun.serve({
  fetch() {
    const body = figlet.textSync("Bun!"); // eslint-disable-line n/no-sync
    return new Response(body);
  },
  port: 3_000,
});

console.log(`Listening on http://localhost:${server.port} ...`);
