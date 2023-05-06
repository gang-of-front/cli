import debug from 'debug';
import s3 from '@auth0/s3'

const log = debug('@gang-of-front/cli:actions:microfrontends-sync');

async function microfrontendSyncCommand(
  _,
  { distPath, bucket, outputPath, s3Endpoint },
) {
  const client = s3.createClient({
    s3Options: {
      region: "auto",
      endpoint: s3Endpoint
    }
  })

  var params = {
    localDir: distPath,
    s3Params: {
      Bucket: bucket,
      Prefix: outputPath,
    },
  };

  const uploader = client.uploadDir(params);

  uploader.on('error', function(err) {
    console.error("unable to sync:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
  });
}

export default function(plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('microfrontends-sync', microfrontendSyncCommand);
}
