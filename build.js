import esbuild from "esbuild";

esbuild
  .build({
    bundle: true,
    entryPoints: ["./source/main.ts"],
    format: "esm",
    inject: ["./source/cjs-shim.ts"],
    outfile: "./output/main.js",
    platform: "node",
    target: "node18",
  })
  .catch(console.error);
