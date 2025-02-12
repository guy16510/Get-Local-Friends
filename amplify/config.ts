import { defineConfig } from '@aws-amplify/backend';

export const config = defineConfig({
  name: 'get-local-friends',
  appId: 'your-app-id', // Replace with your Amplify app ID
  backend: {
    sandbox: {
      path: './backend'
    }
  }
});
