import { spawn } from 'child_process';
import debug from 'debug';
import { didSucceed } from '../utils/didSuccess.js';

const log = debug('@gof/cli:actions:git');

function gitCommand(_, { verbose, path, command, params = [] }) {
  const spawnOptions = verbose
    ? {
        cwd: path,
        shell: true,
        stdio: 'inherit',
      }
    : {
        cwd: path,
      };

  return new Promise((resolve, reject) => {
    log('Running', ['git', ...command, ...params].join(' '), 'with options : ', spawnOptions);
    console.log('Running', ['git', ...command].join(' '));

    const child = spawn('git', [...command, ...params], spawnOptions);

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
  plop.setActionType('git', gitCommand);
}
