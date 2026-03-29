import { copyFileSync } from "fs";

await Bun.build({
	entrypoints: ["./index.html"],
	outdir: "./dist",
	minify: true,
	sourcemap: "inline",
});

copyFileSync("_worker.js", "dist/_worker.js");
