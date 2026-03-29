await Bun.build({
	entrypoints: ["./index.html"],
	outdir: "./dist/jot",
	minify: true,
	sourcemap: "inline",
});
