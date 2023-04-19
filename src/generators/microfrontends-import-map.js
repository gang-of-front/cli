import path from 'path';
import fs from 'fs';

export default async function (plop) {
  await plop.load(['../actions/microfrontends-import-map.js']);

  plop.setGenerator('microfrontends-import-map', {
    description: 'this is a component generator',
    prompts: [
      {
        type: 'input',
        name: 'hash',
        message: 'hash to locate files',
      },
      {
        type: 'input',
        name: 'bucket',
        message: 'bucket',
        default: null,
      },
      {
        type: 'confirm',
        name: 'remoteVerify',
        message: 'Remote file verification',
        default: true,
      },
      {
        type: 'list',
        name: 'environment',
        message: 'What environment to update',
        default: 'prd',
        choices: ['dev', 'stg', 'prd'],
      },
    ],
    actions({ hash, remoteVerify, environment, bucket }) {
      const packJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf8'),
      );
      const [orgName, projectName] = packJson.name
        .replace(/\@/g, '')
        .split('/');

      return [
        {
          type: 'microfrontends-import-map',
          hash,
          remoteVerify,
          environment,
          orgName,
          projectName,
          bucket,
        },
      ];
    },
  });
}
