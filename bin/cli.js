#!/usr/bin/env node
import { Plop } from '../src/Plop.js';
import { run } from '../src/run.js';
import minimist from 'minimist';

const args = process.argv.slice(2);
const argv = minimist(args);

Plop.prepare(
  {
    cwd: argv.cwd,
    preload: argv.preload || [],
    configPath: argv.plopfile,
    completion: argv.completion,
  },
  function (env) {
    Plop.execute(env, run);
  },
);
