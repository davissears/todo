import { serve } from "bun";
import index from "./index.html"; // Bun handles this import

serve({
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
  },
});

// console.log(`Listening on ${server.url}`);
