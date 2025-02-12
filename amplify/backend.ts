import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { handler as contactUsFunction } from './function/contactUsFunction/src/index';
import { handler as geoSpatialFunction } from './function/geoSpatialFunction/src/index';
import { handler as chatFunction } from './function/chatFunction/src/index';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';

// DynamoDB Tables
const chatTable = new Table(this, 'ChatTable', {
  partitionKey: { name: 'messageId', type: AttributeType.STRING },
  tableName: 'Chat',
  removalPolicy: 'DESTROY' // Optional: for dev environments
});

const contactTable = new Table(this, 'ContactTable', {
  partitionKey: { name: 'contactId', type: AttributeType.STRING },
  tableName: 'Contact',
  removalPolicy: 'DESTROY'
});

const geoSpatialTable = new Table(this, 'GeoSpatialTable', {
  partitionKey: { name: 'locationId', type: AttributeType.STRING },
  tableName: 'GeoSpatial',
  removalPolicy: 'DESTROY'
});

// Functions Factory
const functionsFactory = {
  getInstance() {
    return {
      resources: {
        contactUs: contactUsFunction,
        geoSpatial: geoSpatialFunction,
        chat: chatFunction,
      },
    };
  },
};

export default defineBackend({
  auth,
  functions: functionsFactory,
  resources: {
    chatTable,
    contactTable,
    geoSpatialTable,
  },
});