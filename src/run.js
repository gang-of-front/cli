import debug from 'debug';
import nodePlop from 'node-plop';
import minimist from 'minimist';
import { getGenerator } from './getGenerator.js';
import { getByPassArr } from './getByPassArr.js';
import { runGenerator } from './runGenerator.js';
import { getLocalPath } from './getLocalPath.js';

const log = debug('@gof/cli:main');

async function run(env, _, passArgsBeforeDashes) {
  const args = _.slice(2);
  const argv = minimist(args);
  const { _: command, ...params } = argv;
  const generatorName = command[0];

  log({ generatorName });

  const plop = await nodePlop(getLocalPath('../plopfile.js'), {});

  const generator = await getGenerator(plop, generatorName);

  const promptNames = generator.prompts.map((prompt) => prompt.name);

  log(promptNames, Object.keys(params));

  const byPassArr = promptNames
    .map((name) => {
      return params[name];
    })
    .filter(Boolean);

  log({ byPassArr });

  runGenerator(generator, getByPassArr(promptNames, params));
}

export { run };
