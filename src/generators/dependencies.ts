const appParcel = [
    '@axe-core/react',
    '@creditas-ui/system',
    '@creditas-ui/themes',
    '@creditas-ui/typography',
    '@creditas-ui/utilities',
    '@sentry/react',
    'i18next',
    'ramda',
    'react',
    'react-dom',
    'react-i18next',
    'react-router-dom@6',
    'single-spa-react',
  ];
  
  const rootApp = ['single-spa', 'single-spa-layout'];
  
  const dependencies = {
    [`app-parcel`]: appParcel,
    [`root-app`]: rootApp,
  };
  
  const getDependenciesByTemplate = (template) => {
    return dependencies[template] || [];
  };
  
  export default getDependenciesByTemplate;
  