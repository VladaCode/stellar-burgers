const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // Укажите адрес вашего приложения
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});