const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { findTestFiles, resolveTestFilePaths } = require('./utils/test-file-resolver');

const resultsDir = path.join(__dirname, '..', 'tests', 'results');
const rootDir = path.join(__dirname, '..');
const testsDir = path.join(rootDir, 'tests');

// Parse command-line arguments
const args = process.argv.slice(2);
const providedFiles = args.length > 0 ? resolveTestFilePaths(args, rootDir, testsDir) : null;

// Determine which test files to process
const testFiles = providedFiles && providedFiles.length > 0 
  ? providedFiles 
  : findTestFiles(testsDir, rootDir);

// Ensure results directory exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

if (testFiles.length === 0) {
  if (providedFiles !== null) {
    console.log('⚠️  No valid test files found from provided arguments.\n');
  } else {
    console.log('⚠️  No test files found in tests directory.\n');
  }
  process.exit(0);
}

if (providedFiles && providedFiles.length > 0) {
  console.log(`Generating reports for ${testFiles.length} specified test file(s)...\n`);
} else {
  console.log(`Found ${testFiles.length} test file(s). Generating individual test reports...\n`);
}

testFiles.forEach((testFile) => {
  const testFilePath = path.join(rootDir, testFile);
  
  // Check if test file exists
  if (!fs.existsSync(testFilePath)) {
    console.log(`⚠️  Skipping ${testFile} - file not found`);
    return;
  }

  // Extract relative path from tests directory to mirror structure in results
  const testFileFullPath = path.join(rootDir, testFile);
  const relativeFromTestsDir = path.relative(testsDir, testFileFullPath);
  const testFileDir = path.dirname(relativeFromTestsDir);
  
  // Extract test suite name from file path (handle both .test.ts and .spec.ts)
  const basename = path.basename(testFile);
  const suiteName = basename.endsWith('.spec.ts') 
    ? path.basename(testFile, '.spec.ts')
    : path.basename(testFile, '.test.ts');
  
  // Create mirrored directory structure in results
  const outputDir = testFileDir === '.' 
    ? resultsDir 
    : path.join(resultsDir, testFileDir);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `${suiteName}-report.html`);

  console.log(`Running ${testFile}...`);

  try {
    // Create a temporary jest config with custom output path
    const baseConfig = require('../jest.config.js');
    const tempConfigPath = path.join(rootDir, 'jest.config.temp.js');
    
    const tempConfig = {
      ...baseConfig,
      reporters: [
        'default',
        [
          'jest-html-reporter',
          {
            pageTitle: `${suiteName} Test Results`,
            outputPath: outputPath.replace(/\\/g, '/'), // Use forward slashes for paths
            includeFailureMsg: true,
            includeSuiteFailure: true,
          },
        ],
      ],
    };

    // Write temp config - need to handle the function in preset
    const configContent = `const baseConfig = require('./jest.config.js');
module.exports = {
  ...baseConfig,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: '${suiteName} Test Results',
        outputPath: '${outputPath.replace(/\\/g, '/')}',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
};`;
    fs.writeFileSync(tempConfigPath, configContent);

    // Run jest for this specific test file
    execSync(
      `npx jest "${testFile}" --config="${tempConfigPath}"`,
      {
        stdio: 'inherit',
        cwd: rootDir,
        env: { ...process.env, NODE_ENV: 'test' },
      }
    );

    // Clean up temp config
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
    }

    console.log(`✅ Generated report: ${outputPath}\n`);
  } catch (error) {
    console.error(`❌ Error generating report for ${testFile}`);
    // Clean up temp config if it exists
    const tempConfigPath = path.join(rootDir, 'jest.config.temp.js');
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
    }
    // Don't throw - continue with other test files
  }
});

console.log('All test reports generated.\n');

