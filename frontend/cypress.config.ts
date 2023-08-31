import { defineConfig } from 'cypress'
import synpressPlugins from '@synthetixio/synpress/plugins'

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      synpressPlugins(on, config)
    },
    baseUrl: 'http://localhost:3000',
    supportFile: './cypress/support/e2e.ts',
  },
})
