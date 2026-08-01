const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    // The codebase is CommonJS; vitest itself cannot be require()d, so test
    // files use the injected globals (describe/it/expect/beforeAll/...).
    globals: true,
    setupFiles: ['./tests/setup.js'],
    // API tests share one in-memory Mongo and wipe collections between
    // tests, so files must not run concurrently.
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000 // first run downloads the MongoDB binary
  }
});
