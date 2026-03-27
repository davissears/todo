await Bun.build({
	entrypoints: ["./index.html"],
	outdir: "./dist",
	minify: true,
	sourcemap: "external",
});
