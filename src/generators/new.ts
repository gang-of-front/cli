import path from 'path';
import fs from 'fs';
import devDependencies from './dev-dependencies.js';
import dependencies from './dependencies.js';
import { isDebug } from '../utils/isDebug.js';
import { getLocalPath } from '../getLocalPath.js';
import { NodePlopAPI } from 'plop';

type Actions = {
  template: string | undefined;
  orgName: string | undefined;
  projectName: string | undefined;
};

export default async function (plop) {
  const templatesChoices = fs.readdirSync(getLocalPath('./templates'));

  await plop.load([
    '../actions/yarn.js',
    '../actions/git.js',
    '../actions/chmod.js',
  ]);

  plop.setGenerator('create', {
    description: 'this is a MFE generator',
    prompts: [
      {
        type: 'input',
        name: 'orgName',
        message:
          'Organization name (can use letters, numbers, dash or underscore)',
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name (can use letters, numbers, dash or underscore)',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select type to generate',
        choices: templatesChoices,
        default: 'app-parcel',
      },
    ],
    actions({ template, orgName, projectName }: Actions) {
      const destPath = path.join(process.cwd(), `${orgName}-${projectName}`);

      const hasInstallDevDeps = devDependencies(template).length >= 1;
      const hasInstallDeps = dependencies(template).length >= 1;
      const hasPermissionScripts = template === 'frontend-infrastructure';

      return [
        {
          type: 'addMany',
          destination: destPath,
          base: `../templates/${template}`,
          templateFiles: `../templates/${template}/**/*`,
          globOptions: { dot: true },
          abortOnFail: true,
          verbose: isDebug,
          data: { orgName, projectName },
        },
        {
          type: 'add',
          path: path.join(destPath, '.gitignore'),
          templateFile: `../templates/${template}/.npmignore`,
          abortOnFail: false,
          data: { orgName, projectName },
        },
        {
          type: 'git',
          command: ['init'],
          path: destPath,
        },
        hasInstallDevDeps && {
          type: 'yarn',
          command: ['add', '-D'],
          params: devDependencies(template),
          path: destPath,
        },
        hasInstallDeps && {
          type: 'yarn',
          command: ['add'],
          params: dependencies(template),
          path: destPath,
        },
        hasPermissionScripts && {
          type: 'chmod',
          command: ['+x'],
          files: [
            './terraform/deploy/apply.sh',
            './terraform/deploy/init.sh',
            './terraform/deploy/plan.sh',
          ],
          path: destPath,
        },
        {
          type: 'git',
          command: ['add'],
          params: ['.'],
          path: destPath,
        },
        {
          type: 'git',
          command: ['commit'],
          params: ['-m', 'chore: initial structure'],
          path: destPath,
        },
      ].filter(Boolean);
    },
  });
}
