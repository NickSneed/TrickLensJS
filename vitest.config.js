import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    //setupFiles: ['./src/_vitest.setup.js'],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        ...configDefaults.coverage.exclude,
        "src/main.js",
        "src/configs/getyargs.js",
      ],
    },
  },
});
