import debug from 'debug';
import mime from 'mime-types';
import { S3Client } from '@aws-sdk/client-s3';
import S3SyncClient from 's3-sync-client';

const log = debug('@gof/cli:actions:microfrontends-sync');

async function microfrontendSyncCommand(
  _,
  { distPath, outputBucket, environment, orgName, projectName, hash, endpoint },
) {
  const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint
  });
  
  const { sync } = new S3SyncClient({ client: s3Client });
  
  log(`Running sync dist=${distPath} bucket:${outputBucket}`);
  log({ distPath, outputBucket });

  const results = await sync(distPath, outputBucket, {
    commandInput: {
      ACL: 'bucket-owner-full-control',
      ContentType: (syncCommandInput) => mime.lookup(syncCommandInput.Key) || 'text/html',
      CacheControl: 'public, max-age=31536000',
    },
  });

  console.log('\n');
  console.log(`Finish sync`, results);
  console.log(
    `\nEntrypoint: https://assets.gangoffront.com/microfrontends/${environment}/${orgName}/${projectName}/${hash}/${orgName}-${projectName}.js`,
  );
}

export default function (plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('microfrontends-sync', microfrontendSyncCommand);
}
