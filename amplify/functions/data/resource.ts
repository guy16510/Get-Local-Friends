import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
export const ddbDocClient = DynamoDBDocumentClient.from(client);

export const USERS_TABLE = process.env.USERS_TABLE || 'Users';
export const CONTACTS_TABLE = process.env.CONTACTS_TABLE || 'Contacts';
