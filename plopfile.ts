import { NodePlopAPI } from 'plop';

export default async function (plop: NodePlopAPI) {
  const generators = ['./src/generators/new.ts'];

  await plop.load(generators);
}
