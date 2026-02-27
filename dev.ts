import { serve } from "bun";
import index from "./index.html"; // Bun handles this import

serve({
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
  },
  // Keep your fetch handler if you need to serve other static assets manually,
  // or use the new 'static' feature in newer Bun versions.
  async fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Not Found", { status: 404 });
  },
});

// console.log(`Listening on ${server.url}`);
