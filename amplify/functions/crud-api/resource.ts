import { defineFunction } from '@aws-amplify/backend';

export const myApiFunction = defineFunction({
  entry: '/index.ts',
});
