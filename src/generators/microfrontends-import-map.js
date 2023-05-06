import debug from 'debug';
import path from 'path';
import fs from 'fs';

const log = debug('@gang-of-front/cli:generators:microfrontends-import-map');

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
        message: 'bucket name',
        default: undefined,
      },
      {
        type: 'input',
        name: 's3Endpoint',
        message: 's3Endpoint',
        default: undefined,
      },
      {
        type: 'input',
        name: 'domainBucket',
        message: 'public domain of bucket',
        default: 'https://assets.gangoffront.com',
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
        default: 'prod',
        choices: ['dev', 'stg', 'prod'],
      },
    ],
    actions({ hash, remoteVerify, environment, bucket, domainBucket, s3Endpoint }) {
      const packJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf8'),
      );
      const [orgName, projectName] = packJson.name
        .replace(/\@/g, '')
        .split('/');

      log(
        `orgName=${orgName}, projectName=${projectName}, package.json.name=${packJson.name}`,
      );

      return [
        {
          type: 'microfrontends-import-map',
          remoteVerify,
          bucket,
          domainBucket,
          s3Endpoint,
          environment,
          orgName,
          projectName,
          hash
        },
      ];
    },
  });
}
