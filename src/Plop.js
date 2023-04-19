import Liftoff from 'liftoff';
import v8flags from 'v8flags';
import interpret from 'interpret';

const Plop = new Liftoff({
  name: '@gof/cli',
  // Remove this when this PR is merged:
  // https://github.com/gulpjs/interpret/pull/75
  extensions: { ...interpret.jsVariants, ['.cjs']: null },
  v8flags: v8flags,
});

export { Plop };
