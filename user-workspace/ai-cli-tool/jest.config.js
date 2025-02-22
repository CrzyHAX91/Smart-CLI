/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.json' }]
  },
  moduleFileExtensions: ['js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|inquirer|ora|boxen|figlet|string-width|strip-ansi|ansi-styles|ansi-regex|widest-line|camelcase)/)'
  ],
  verbose: true,
  testTimeout: 10000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  setupFiles: ['./jest.setup.js']
}
