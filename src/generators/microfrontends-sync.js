import path from 'node:path';
import fs from 'fs';

export default async function (plop) {
  await plop.load(['../actions/microfrontends-sync.js']);

  plop.setGenerator('microfrontends-sync', {
    description: 'this is a component generator',
    prompts: [
      {
        type: 'input',
        name: 'dist',
        message: 'Dist folder',
        default: './dist',
      },
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
        type: 'input',
        name: 's3Endpoint',
        message: 's3Endpoint',
        default: null,
      },
      {
        type: 'list',
        name: 'environment',
        message: 'What environment to update',
        default: 'production',
        choices: ['dev', 'stg', 'prod'],
      },
    ],
    actions({ dist, hash, environment, bucket, s3Endpoint }) {
      const packJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf8'),
      );
      const [orgName, projectName] = packJson.name
        .replace(/\@/g, '')
        .split('/');
      const distPath = path.join(process.cwd(), dist);

      const outputPath = path.join(
        'microfrontends',
        environment,
        orgName,
        projectName,
        hash,
      );

      return [
        {
          type: 'microfrontends-sync',
          distPath,
          bucket,
          outputPath,
          s3Endpoint
        },
      ];
    },
  });
}
