const appParcel = [
  '@commitlint/cli',
  '@commitlint/config-conventional',
  '@creditas-ui/test-utils',
  '@emotion/jest',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@types/react',
  '@types/react-dom',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'babel-polyfill',
  'circle-github-bot',
  'copy-webpack-plugin',
  'cross-env',
  'dotenv-webpack',
  'eslint',
  'eslint-config-airbnb-typescript',
  'eslint-config-prettier',
  'eslint-config-react-app',
  'eslint-import-resolver-typescript',
  'eslint-plugin-import',
  'eslint-plugin-json',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-prettier',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'husky',
  'jest',
  "jest-environment-jsdom",
  'jest-localstorage-mock',
  'jest-transform-stub',
  'jest-watch-typeahead',
  'lint-staged',
  'msw',
  'mutationobserver-shim',
  'prettier',
  'pretty-quick',
  'ts-config-single-spa',
  'ts-jest',
  'typescript',
  'webpack',
  'webpack-cli',
  'webpack-config-single-spa-react-ts',
  'webpack-dev-server',
  'webpack-merge',
];

const rootApp = [
  '@babel/core',
  '@babel/eslint-parser',
  '@babel/plugin-transform-runtime',
  '@babel/preset-env',
  '@babel/preset-typescript',
  '@babel/runtime',
  '@commitlint/cli',
  '@commitlint/config-conventional',
  '@types/jest',
  '@types/systemjs',
  '@types/webpack-env',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'circle-github-bot',
  'concurrently',
  'copy-webpack-plugin',
  'cross-env',
  'dotenv-webpack',
  'eslint',
  'eslint-config-prettier',
  'eslint-config-ts-important-stuff',
  'eslint-plugin-prettier',
  'html-webpack-plugin',
  'husky',
  'jest',
  'jest-localstorage-mock',
  'jest-transform-stub',
  'jest-watch-typeahead',
  'lint-staged',
  'msw',
  'prettier',
  'pretty-quick',
  'ts-config-single-spa',
  'ts-jest',
  'typescript',
  'webpack',
  'webpack-cli',
  'webpack-config-single-spa-ts',
  'webpack-dev-server',
  'webpack-merge',
];

const dependencies = {
  [`app-parcel`]: appParcel,
  [`root-app`]: rootApp,
};

const getDependenciesByTemplate = (template) => {
  return dependencies[template] || [];
};

export default getDependenciesByTemplate;