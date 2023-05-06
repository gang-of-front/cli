import chalk from 'chalk';

function loggerCommand(_, { message, raw = false }) {
  if (raw) {
    console.log(message);
  } else {
    console.log(`${chalk.green('[@creditas/cli LOGGER]')}`);
    console.log(`${chalk.green(message)}`);
  }
}

export default function (plop) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType('logger', loggerCommand);
}
