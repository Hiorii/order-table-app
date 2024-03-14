import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: '**/*.cy.ts',
    env: {
      baseUrl: 'http://localhost:4200'
    }
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: '**/*.cy.ts'
  }
});
