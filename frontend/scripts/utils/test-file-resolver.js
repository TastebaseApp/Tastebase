const fs = require('fs');
const path = require('path');

/**
 * Test File Resolver Utility
 * Provides functions for discovering and resolving test file paths
 */

/**
 * Recursively find all .test.ts and .spec.ts files in a directory
 * @param {string} dir - Directory to search
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string[]} Array of relative paths to test files
 */
function findTestFiles(dir, baseDir) {
  const testFiles = [];
  
  if (!fs.existsSync(dir)) {
    return testFiles;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      testFiles.push(...findTestFiles(fullPath, baseDir));
    } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.spec.ts'))) {
      // Found a test file - use relative path from baseDir
      testFiles.push(relativePath.replace(/\\/g, '/'));
    }
  }

  return testFiles;
}

/**
 * Recursively search for a file by name in a directory
 * @param {string} filename - Name of the file to search for
 * @param {string} searchDir - Directory to search in
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string[]} Array of relative paths to matching files
 */
function findFileByName(filename, searchDir, baseDir) {
  const matches = [];
  
  if (!fs.existsSync(searchDir)) {
    return matches;
  }

  const entries = fs.readdirSync(searchDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(searchDir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      matches.push(...findFileByName(filename, fullPath, baseDir));
    } else if (entry.isFile() && entry.name === filename) {
      // Found a matching file - use relative path from baseDir
      matches.push(relativePath.replace(/\\/g, '/'));
    }
  }

  return matches;
}

/**
 * Resolve test file paths from command-line arguments
 * Handles full paths, partial paths, and just filenames
 * @param {string[]} args - Command-line arguments
 * @param {string} rootDir - Root directory of the project
 * @param {string} testsDir - Tests directory path
 * @returns {string[]} Array of resolved test file paths (relative to rootDir)
 */
function resolveTestFilePaths(args, rootDir, testsDir) {
  const resolvedFiles = [];
  const seenFiles = new Set();

  for (const arg of args) {
    // Skip flags
    if (arg.startsWith('--')) {
      continue;
    }

    let resolved = null;

    // Try as absolute path first
    if (path.isAbsolute(arg)) {
      const relativePath = path.relative(rootDir, arg).replace(/\\/g, '/');
      const fullPath = path.join(rootDir, relativePath);
      if (fs.existsSync(fullPath) && (arg.endsWith('.test.ts') || arg.endsWith('.spec.ts'))) {
        resolved = relativePath;
      }
    }
    // Try as relative path from rootDir
    else {
      const fullPath = path.join(rootDir, arg);
      if (fs.existsSync(fullPath) && (arg.endsWith('.test.ts') || arg.endsWith('.spec.ts'))) {
        resolved = arg.replace(/\\/g, '/');
      }
      // Try relative to tests directory
      else {
        const testsPath = path.join(testsDir, arg);
        if (fs.existsSync(testsPath) && (arg.endsWith('.test.ts') || arg.endsWith('.spec.ts'))) {
          const relativePath = path.relative(rootDir, testsPath).replace(/\\/g, '/');
          resolved = relativePath;
        }
      }
    }

    // If not found as path, try searching by filename
    if (!resolved) {
      const filename = path.basename(arg);
      // Only search if it looks like a test file
      if (filename.endsWith('.test.ts') || filename.endsWith('.spec.ts')) {
        const matches = findFileByName(filename, testsDir, rootDir);
        if (matches.length > 0) {
          if (matches.length > 1) {
            console.log(`ℹ️  Found ${matches.length} files matching "${filename}":`);
            matches.forEach(match => console.log(`   - ${match}`));
            console.log(`   Generating reports for all matches.\n`);
          }
          matches.forEach(match => {
            if (!seenFiles.has(match)) {
              resolvedFiles.push(match);
              seenFiles.add(match);
            }
          });
          continue;
        }
      }
    }

    // If we found a resolved path, add it
    if (resolved) {
      if (!seenFiles.has(resolved)) {
        resolvedFiles.push(resolved);
        seenFiles.add(resolved);
      }
    } else {
      console.log(`⚠️  Could not find test file: ${arg}`);
    }
  }

  return resolvedFiles;
}

module.exports = {
  findTestFiles,
  findFileByName,
  resolveTestFilePaths,
};

