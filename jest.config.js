/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  setupFilesAfterEnv: ['./jest.setup.js'],
}
