import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { Function } from '@aws-amplify/backend-function';

// Get the environment name and ensure AWS environment variables are available
const envName = process.env.USER_BRANCH || 'dev';
if (!process.env.AWS_REGION || !process.env.AWS_ACCOUNT_ID) {
  throw new Error('AWS_REGION and AWS_ACCOUNT_ID environment variables must be set');
}

// Define the schema for your tables
const schema = {
  version: '1',
  tables: {
    Chat: {
      primaryIndex: {
        partitionKey: { name: 'messageId', type: 'string' },
        sortKey: { name: 'timestamp', type: 'string' }
      },
      secondaryIndexes: {
        bySenderReceiver: {
          partitionKey: { name: 'senderId', type: 'string' },
          sortKey: { name: 'receiverId', type: 'string' }
        }
      },
      ttl: {
        attributeName: 'ttl'
      }
    },
    Contact: {
      primaryIndex: {
        partitionKey: { name: 'contactId', type: 'string' },
        sortKey: { name: 'createdAt', type: 'string' }
      }
    },
    GeoSpatial: {
      primaryIndex: {
        partitionKey: { name: 'userId', type: 'string' },
        sortKey: { name: 'geohash', type: 'string' }
      },
      secondaryIndexes: {
        byGeohash: {
          partitionKey: { name: 'geohash', type: 'string' },
          sortKey: { name: 'userId', type: 'string' }
        }
      },
      ttl: {
        attributeName: 'ttl'
      }
    }
  }
};

// Define Functions
const contactUsFunction = new Function('contactUsFunction', {
  handler: './function/contactUsFunction/src/index.ts',
  environment: {
    CONTACT_TABLE_NAME: `${envName}-Contact`,
    SENDER_EMAIL: process.env.SENDER_EMAIL || 'your-verified-email@domain.com',
    RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL || 'your-support@domain.com',
    AWS_REGION: process.env.AWS_REGION || '',
    AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID || ''
  },
  permissions: [{
    actions: [
      'ses:SendEmail',
      'ses:SendRawEmail'
    ],
    resources: ['*']
  },
  {
    actions: [
      'dynamodb:PutItem',
      'dynamodb:GetItem',
      'dynamodb:Query',
      'dynamodb:Scan'
    ],
    resources: [
      `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${envName}-Contact`,
      `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${envName}-Contact/index/*`
    ]
  }]
});

const geoSpatialFunction = new Function('geoSpatialFunction', {
  handler: './function/geoSpatialFunction/src/index.ts',
  environment: {
    LOCATIONS_TABLE_NAME: `${envName}-GeoSpatial`,
    AWS_REGION: process.env.AWS_REGION || '',
    AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID || ''
  },
  permissions: [{
    actions: [
      'dynamodb:PutItem',
      'dynamodb:GetItem',
      'dynamodb:Query',
      'dynamodb:Scan'
    ],
    resources: [
      `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${envName}-GeoSpatial`,
      `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${envName}-GeoSpatial/index/*`
    ]
  }]
});

const chatFunction = new Function('chatFunction', {
  handler: './function/chatFunction/src/index.ts',
  environment: {
    CHAT_TABLE_NAME: `${envName}-Chat`,
    AWS_REGION: process.env.AWS_REGION || '',
    AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID || ''
  },
  permissions: [{
    actions: [
      'dynamodb:PutItem',
      'dynamodb:GetItem',
      'dynamodb:Query',
      'dynamodb:Scan'
    ],
    resources: [
      `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${envName}-Chat`,
      `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${envName}-Chat/index/*`
    ]
  }]
});

export default defineBackend({
  auth,
  schema,
  functions: {
    contactUsFunction,
    geoSpatialFunction,
    chatFunction
  }
});
