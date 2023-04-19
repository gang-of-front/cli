import debug from 'debug';
import chalk from 'chalk';
import { chooseGenerator } from './chooseGenerator.js';

const log = debug('@gof/cli:getGenerator');

const getGenerator = async (plop, name) => {
  const generators = plop.getGeneratorList();

  log({ generators }, generators.length);

  if (generators.length === 1) {
    log('only one generator', generators[0].name);

    return plop.getGenerator(generators[0].name);
  }

  let generator;

  log({ name });

  try {
    if (name) {
      generator = plop.getGenerator(name);
    } else {
      log('choose');
      const chooseCommand = await chooseGenerator(generators);

      log({ chooseCommand });
      generator = plop.getGenerator(chooseCommand);
    }
  } catch (err) {
    console.log(`${chalk.red('[@gof/cli ERROR]')} Command '${chalk.blue(name)}' not found!`);
    process.exit(1);
  }

  return generator;
};

export { getGenerator };
