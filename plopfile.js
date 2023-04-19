export default async function (plop) {
  const generators = [
    './src/generators/microfrontends-import-map.js',
    './src/generators/microfrontends-sync.js',
  ];

  await plop.load(generators);
}
