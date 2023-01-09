import { spawn } from 'child_process';
import fs from 'fs';

const jsonString = fs.readFileSync('./package.json', 'utf-8');
const pkg = JSON.parse(jsonString);

const dependencies = Object.keys(pkg.dependencies);
const devDependencies = Object.keys(pkg.devDependencies);

const add = (args) => {
  return spawn('yarn', ['add', '--exact'].concat(args), { stdio: 'inherit' });
};

add(dependencies).on('close', () => {
  add(['--dev'].concat(devDependencies)).on('close', (code) => process.exit(Number(code)));
});
