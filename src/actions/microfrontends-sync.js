import debug from 'debug';
import mime from 'mime-types';
import { S3Client, ListBucketsCommand,ListObjectsV2Command } from '@aws-sdk/client-s3';
import S3SyncClient from 's3-sync-client';
import s3 from '@auth0/s3'

const log = debug('@gof/cli:actions:microfrontends-sync');

async function microfrontendSyncCommand(
  _,
  { distPath, bucket, outputPath, s3Endpoint },
) {
  // const s3Client = new S3Client({
  //   region: "auto",
  //   endpoint: `https://5df477d4f9a8cf72185ef8f44fd1e144.r2.cloudflarestorage.com`
  // });

  const client = s3.createClient({
    s3Options: {
      // accessKeyId: "your s3 key",
      // secretAccessKey: "your s3 secret",
      region: "auto",
      endpoint: s3Endpoint
    }
  })

  var params = {
    localDir: distPath,
    deleteRemoved: true, // default false, whether to remove s3 objects

    s3Params: {
      Bucket: bucket,
      Prefix: outputPath,
    },
  };

  var uploader = client.uploadDir(params);

  uploader.on('error', function(err) {
    console.error("unable to sync:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
  });

  // console.log(
  //   await s3Client.send(
  //     new ListBucketsCommand('')
  //   )
  // );
  // console.log(
  //   await s3Client.send(
  //     new ListObjectsV2Command({ Bucket: 'demo-gangoffront-com' })
  //   )
  // );

  // const { sync } = new S3SyncClient({ client: s3Client });

  // log(`Running sync dist=${distPath} bucket:${outputBucket}`);
  // log({ distPath, outputBucket });

  // const results = await sync(distPath, outputBucket, {
  //   commandInput: {
  //     ACL: 'bucket-owner-full-control',
  //     ContentType: (syncCommandInput) => mime.lookup(syncCommandInput.Key) || 'text/html',
  //     CacheControl: 'public, max-age=31536000',
  //   },
  // });

  // console.log('\n');
  // console.log(`Finish sync`, results);
  // console.log(
    // `\nEntrypoint: https://assets.gangoffront.com/microfrontends/${environment}/${orgName}/${projectName}/${hash}/${orgName}-${projectName}.js`,
  // );
}

export default function(plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('microfrontends-sync', microfrontendSyncCommand);
}
