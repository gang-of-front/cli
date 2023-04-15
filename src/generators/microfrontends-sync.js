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
        type: 'list',
        name: 'environment',
        message: 'What environment to update',
        default: 'production',
        choices: ['dev', 'stg', 'prod'],
      },
    ],
    actions({ dist, hash, environment, bucket }) {
      const packJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf8'),
      );
      const [orgName, projectName] = packJson.name
        .replace(/\@/g, '')
        .split('/');
      const distPath = path.join(process.cwd(), dist);

      const outputPath = path.join(
        'demo-gangoffront-com',
        environment,
        orgName,
        projectName,
        hash,
      );

      //const outputBucket = `https://5df477d4f9a8cf72185ef8f44fd1e144.r2.cloudflarestorage.com/${outputPath}`.replace(/\/$/, '');
      const outputBucket = 's3://5df477d4f9a8cf72185ef8f44fd1e144.r2.cloudflarestorage.com';

      return [
        {
          type: 'microfrontends-sync',
          distPath,
          outputBucket,
          environment,
          orgName,
          projectName,
          hash,
          bucket,
        },
      ];
    },
  });
}
