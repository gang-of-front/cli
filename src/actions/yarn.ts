import { spawn, SpawnOptions } from 'child_process';
import debug from 'debug';
import { didSucceed } from '../utils/didSuccess.js';

const log = debug('@gof/cli:actions:yarn');

function yarnCommand(_, { verbose, path, command, params = [] }) {
  const spawnOptions = verbose
    ? ({
        cwd: path,
        shell: true,
        stdio: 'inherit',
      } as SpawnOptions)
    : ({
        cwd: path,
      } as SpawnOptions);

  return new Promise((resolve, reject) => {
    log(
      'Running',
      ['yarn', ...command, ...params].join(' '),
      'with options : ',
      spawnOptions,
    );
    console.log('Running', ['yarn', ...command].join(' '));

    const child = spawn('yarn', [...command, ...params], spawnOptions);

    child.on('close', (code) => {
      if (didSucceed(code)) {
        resolve(`command ran correctly`);
      } else {
        reject(`command exited with ${code}`);
      }
    });
  });
}

export default function (plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('yarn', yarnCommand);
}
