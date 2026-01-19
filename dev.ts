import { serve } from "bun";

const server = serve({
  development: true,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/")
      return new Response(Bun.file("./index.html"), {
        headers: { "Content-Type": "text/html" },
      });

    const file = Bun.file(`.${url.pathname}`);
    if (!(await file.exists())) {
      return new Response("Not Found", { status: 404 });
    }
    return new Response(file);
  },
});

console.log(`Listening on ${server.url}`);
