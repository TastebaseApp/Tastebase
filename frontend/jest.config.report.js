const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Most-Recent Frontend Test Results',
        outputPath: '<rootDir>/tests/results/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
};

