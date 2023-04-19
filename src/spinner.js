import ora from 'ora';
import { isInJest } from './utils/isInJest.js';

const progressSpinner = ora({
  // Default is stderr
  stream: isInJest ? process.stdout : process.stderr,
  isEnabled: !isInJest,
});

export { progressSpinner };
