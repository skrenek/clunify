#!/usr/bin/env node

var fs = require('fs');

var args     = process.argv,
    files    = fs.readdirSync(process.cwd()),
    toolName = null,
    toolMap = {
      'gulpfile.js': 'gulp',
      'Gruntfile.js': 'grunt',
      'ionic.project': 'ionic'
    },
    toolPriorities = [
      'ionic.project',
      'gulpfile.js',
      'Gruntfile.js'
    ];

if (args[0] === 'node') {
  args.shift();
  args.shift();
}

for (var i = 0; i < toolPriorities.length; i++) {
  for (var j = 0; j < files.length; j++) {
    if (files[j].indexOf(toolPriorities[i]) >= 0) {
      toolName = toolMap[toolPriorities[i]];
      break;
    }
  }
  if (toolName) break;
}

if (toolName) {
  var proc = require('child_process').spawn(toolName, args, {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true,
    env: process.env
  });

  proc.stdout.on('data', function (data) {
    process.stdout.write(data.toString());
  });
  proc.stderr.on('data', function (data) {
    process.stdout.write(data.toString());
  });
} else {
  console.log('No tool match found.');
}
