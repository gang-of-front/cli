import debug from 'debug';
import nodePlop from 'node-plop';

const log = debug('@gang-of-front/cli:chooseGenerator');

async function chooseGenerator(generators) {
  log({ generators });
  const plop = await nodePlop();

  const { runPrompts } = plop.setGenerator('choose', {
    prompts: [
      {
        type: 'list',
        name: 'generator',
        message: 'Select a command',
        choices: generators.map(function (generator) {
          return {
            name: generator.name + (!!generator.description ? ' - ' + generator.description : ''),
            value: generator.name,
          };
        }),
      },
    ],
  });

  const { generator } = await runPrompts();
  return generator;
}

export { chooseGenerator };
