import debug from 'debug';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import { diffString } from 'json-diff';

const log = debug('@gof/cli:actions:microfrontends-import-map');

async function remoteFileExists(url) {
  const response = await fetch(url);

  return response.status === 200;
}

async function getImportMapFile(environment, bucket, client) {
  const getImportMapCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: `microfrontends/${environment}/import-map.json`,
  });

  const response = await client.send(getImportMapCommand);
  log('Response of get import map object from s3', { response });

  const importMapText = (await response?.Body?.transformToString()) ?? '';
  log('Content of import-map.json', importMapText);

  return JSON.parse(importMapText);
}

function addOrUpdateService(importMapJson, { service, url }) {
  const newImportMapJson = {
    imports: { ...importMapJson.imports },
    scopes: { ...importMapJson.scopes },
  };
  newImportMapJson.imports[service] = url;
  newImportMapJson.imports[`${service}/`] = url.slice(
    0,
    url.lastIndexOf('/') + 1,
  );

  return newImportMapJson;
}

async function updateImportMap(content, environment, bucket, client) {
  const updateImportmapCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: `microfrontends/${environment}/import-map.json`,
    Body: JSON.stringify(content),
    ContentType: 'application/importmap+json',
    CacheControl: 'public, must-revalidate, max-age=0',
    ACL: 'bucket-owner-full-control',
  });

  const result = await client.send(updateImportmapCommand);

  log('import-map.json updated', result);

  return result;
}

async function microfrontendImportMapCommand(
  _,
  { environment, remoteVerify, orgName, projectName, hash, bucket },
) {
  const client = new S3Client({
    region: 'us-east-1',
    endpoint: bucket,
  });

  const url = `https://assets.gangoffront.com/microfrontends/${environment}/${orgName}/${projectName}/${hash}/${orgName}-${projectName}.js`;

  log(
    `Running update import-map.json env=${environment} with service=${orgName}/${projectName} and url=${url}`,
  );

  if (remoteVerify && !(await remoteFileExists(url))) {
    throw new Error(`File not found! ${url}`);
  }

  const importMapJson = await getImportMapFile(environment, bucket, client);

  const newImportMapJson = addOrUpdateService(importMapJson, {
    service: `@${orgName}/${projectName}`,
    url,
  });

  console.log(diffString(importMapJson, newImportMapJson));

  await updateImportMap(newImportMapJson, environment, bucket, client);

  console.log('\n');
  console.log(`${environment} import-map.json updated!`);
  console.log(
    `https://assets.gangoffront.com/microfrontends/${environment}/import-map.json`,
  );
}

export default function (plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType(
    'microfrontends-import-map',
    microfrontendImportMapCommand,
  );
}
