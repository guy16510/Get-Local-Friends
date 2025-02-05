import { defineFunction } from '@aws-amplify/backend';
import { CONTACTS_TABLE, ddbDocClient } from '../data/resource';

export const TableName = CONTACTS_TABLE;
export { ddbDocClient };

export const contact = defineFunction({
  name: 'contact',
  entry: './handler.ts'
});
