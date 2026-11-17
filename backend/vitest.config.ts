import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "./backend",
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    restoreMocks: true,
    clearMocks: true
  }
});
