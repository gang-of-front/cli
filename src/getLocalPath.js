import debug from 'debug';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const log = debug('@creditas/cli:getLocalPath');

const getLocalPath = (targetPath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const localPath = path.join(__dirname, targetPath);

  log({ __filename });
  log({ __dirname });
  log({ targetPath });
  log({ localPath });

  return localPath;
};

export { getLocalPath };
