import { defineFunction } from '@aws-amplify/backend';
import { Policies } from '@aws-amplify/backend-shared';

export const userProfileFunction = defineFunction({
  name: 'userProfile',
  entry: './handler.ts',
  environment: {
    USER_PROFILE_TABLE_NAME: '${env.USER_PROFILE_TABLE_NAME}'
  },
  policies: [
    Policies.DynamoDB.readWriteTable('UserProfileTable')
  ]
});