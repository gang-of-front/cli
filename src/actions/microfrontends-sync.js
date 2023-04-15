import debug from 'debug';
import mime from 'mime-types';
import { S3Client, ListBucketsCommand,ListObjectsV2Command } from '@aws-sdk/client-s3';
import S3SyncClient from 's3-sync-client';

const log = debug('@gof/cli:actions:microfrontends-sync');

async function microfrontendSyncCommand(
  _,
  { distPath, outputBucket, environment, orgName, projectName, hash, endpoint },
) {
  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://5df477d4f9a8cf72185ef8f44fd1e144.r2.cloudflarestorage.com`
  });

  console.log(
    await s3Client.send(
      new ListBucketsCommand('')
    )
  );
  console.log(
    await s3Client.send(
      new ListObjectsV2Command({ Bucket: 'demo-gangoffront-com' })
    )
  );

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

export default function(plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('microfrontends-sync', microfrontendSyncCommand);
}
