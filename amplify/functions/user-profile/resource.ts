import { defineFunction } from '@aws-amplify/backend';

export const userProfileFunction = defineFunction({
  name: 'userProfile',
  entry: './handler.ts',
  environment: {
    USER_PROFILE_TABLE_NAME: '${env.USER_PROFILE_TABLE_NAME}'
  }
});

// Attach permissions separately
userProfileFunction.attachPermissions(['dynamodb']);