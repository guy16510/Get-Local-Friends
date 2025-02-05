import { defineFunction } from '@aws-amplify/backend';

export const contactFunction = defineFunction({
  entry: './handler.ts',  // Path relative to this file
  environment: {
    // any environment variables for your contact function
  },
});