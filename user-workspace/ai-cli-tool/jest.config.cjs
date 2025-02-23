/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.json' }]
  },
  moduleFileExtensions: ['js', 'json', 'cjs', 'mjs'],
  testMatch: ['**/__tests__/**/*.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|inquirer|ora|boxen|figlet|node-fetch)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleDirectories: ['node_modules'],
  testTimeout: 10000,
  verbose: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  resolver: undefined,
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'services/**/*.js',
    'commands/**/*.js',
    'utils/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
}
