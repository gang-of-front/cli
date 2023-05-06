import debug from 'debug';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import path from 'path';
import fetch from 'node-fetch';
import { diffString } from 'json-diff';

const log = debug('@gang-of-front/cli:actions:microfrontends-import-map');

async function remoteFileExists(url) {
  const response = await fetch(url);
  return response.status === 200;
}

async function downloadImportMap(environment, client, bucketName) {
  const getImportMapCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: `microfrontends/${environment}/import-map.json`,
  });

  try {
    const response = await client.send(getImportMapCommand);
    log('Response of get import map object from s3', { response });

    const importMapText = await response.Body.transformToString();
    log('Content of import-map.json', importMapText);

    return JSON.parse(importMapText);
  } catch (error) {
    if (error.Code !== 'NoSuchKey') throw new Error(error);
    return { imports: {}, scopes: {} };
  }
}

async function uploadImportMap(content, environment, client, bucketName) {
  const updateImportmapCommand = new PutObjectCommand({
    Bucket: bucketName,
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

async function microfrontendImportMapCommand(
  _,
  {
    remoteVerify,
    bucket,
    s3Endpoint,
    domainBucket,
    environment,
    orgName,
    projectName,
    hash,
  } = {},
) {
  const client = new S3Client({
    region: 'auto',
    endpoint: s3Endpoint,
  });

  const outputPath = path.join(
    'microfrontends',
    environment,
    orgName,
    projectName,
    hash,
    `${orgName}-${projectName}.js`,
  );

  const serviceUrl = path.join(domainBucket, outputPath);

  if (remoteVerify && remoteFileExists(serviceUrl)) {
    throw new Error(`File not found! ${serviceUrl}`);
  }

  const importMapJson = await downloadImportMap(environment, client, bucket);

  const newImportMapJson = addOrUpdateService(importMapJson, {
    service: `@${orgName}/${projectName}`,
    url: serviceUrl,
  });

  console.log(diffString(importMapJson, newImportMapJson));

  await uploadImportMap(newImportMapJson, environment, client, bucket);
}

export default function (plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType(
    'microfrontends-import-map',
    microfrontendImportMapCommand,
  );
}
