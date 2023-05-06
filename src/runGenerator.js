import debug from 'debug';
import { progressSpinner } from './spinner.js';

const log = debug('@gang-of-front/cli:runGenerator');

const runGenerator = async ({ runPrompts, runActions }, byPassArr) => {
  let failedActions = false;
  const answers = await runPrompts(byPassArr);

  log({ answers });

  const onComment = (msg) => {
    progressSpinner.info(msg);
    progressSpinner.start();
  };

  const onSuccess = (change) => {
    let line = '';
    if (change.type) {
      line += ` ${change.type}`;
    }
    if (change.path) {
      line += ` ${change.path}`;
    }
    progressSpinner.succeed(line);
    progressSpinner.start();
  };

  const onFailure = (fail) => {
    let line = '';
    if (fail.type) {
      line += ` ${fail.type}`;
    }
    if (fail.path) {
      line += ` ${fail.path}`;
    }
    const errMsg = fail.error || fail.message;
    if (errMsg) {
      line += ` ${errMsg}`;
    }

    progressSpinner.fail(line);
    failedActions = true;
    progressSpinner.start();
  };

  await runActions(answers, { onSuccess, onFailure, onComment });

  progressSpinner.stop();

  if (failedActions) process.exit(1);
};

export { runGenerator };
