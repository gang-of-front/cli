import { spawn, SpawnOptions } from 'child_process';
import debug from 'debug';
import { CustomActionFunction, NodePlopAPI } from 'plop';
import { didSucceed } from '../utils/didSuccess';

const log = debug('@gof/cli:actions:chmod');

function chmodCommand(
  _,
  { verbose, path, command, files = [] },
): Promise<CustomActionFunction> {
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
      ['chmod', ...command, ...files].join(' '),
      'with options : ',
      spawnOptions,
    );

    console.log('Running', ['chmod', ...command, ...files].join(' '));

    const child = spawn('chmod', [...command, ...files], spawnOptions);

    child.on('close', (code) => {
      if (didSucceed(code)) {
        resolve(`command ran correctly`);
      } else {
        reject(`command exited with ${code}`);
      }
    });
  });
}

export default function (plop: NodePlopAPI) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('chmod', chmodCommand);
}
