// functions/directMessage/resource.ts
import { defineFunction } from '@aws-amplify/backend';
import { data } from '../../data/resource';

// Define the Lambda function
export const directMessageFunction = defineFunction({
  entry: './functions/directMessage/index.ts',
  environment: {
    CONVERSATION_TABLE: 'Conversation',
    MESSAGE_TABLE: 'Message',
  },
});

// Grant access to the entire data resource
// data.grantReadWriteAccess(directMessageFunction);