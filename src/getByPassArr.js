import debug from 'debug';

const log = debug('@gof/cli:getByPassArr');

const getByPassArr = (promptNames, params) => {
  const byPassArr = promptNames.map((name) => params[name]).filter(Boolean);

  log({ byPassArr });

  return byPassArr;
};

export { getByPassArr };
