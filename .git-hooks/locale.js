#!/usr/bin/env node

/**
 * What is this? With this small JavaScript file we want 
 * to block the upload of modified files in the "locale" 
 * folder to the repository through a git hook generated 
 * with the Husky library.
 * 
 * Usage: $ node .git-hook/locale.js
 * 
 * Happy releasing!
 */

'use strict'

// Require main dependences.
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Execute Git Diff for get all files with changes.
const results = execSync('git diff --cached --name-only')

// Create array with all files.
const arrayResults = results.toString().trim().split('\n')

// Define array files to not change.
const changedLocalizedFiles = []

function gitHook(expresion) {

  // Define RegExp with reg param.
  const reg = new RegExp(expresion, 'g')

  // Iterate in array for search if RegExp is true or not.
  arrayResults.forEach(file => {
    // Control for search if exist or not file.
    const filepath = path.join(__dirname, '..', file);
    if (fs.existsSync(filepath) && reg.test(filepath)) {
      // Include path reference into array for resolve result console.
      filesNoChange.push({
        Path: filepath
      })
    }
  })

  // Show an error and log table with the list of modified files in the "locale" folder.
  if (filesNoChange.length !== 0) {
    console.error('\x1b[31m', '\n ❌ You can not commit changes of the following files:', '\x1b[0m')
    console.table(filesNoChange)
    process.exit(1)
  }
}

// Launch for locale folder.
gitHook('/locale/')
