import { type AppSyncResolverHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CONTACT_TABLE_NAME;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
  try {
    switch (event.info.fieldName) {
      case 'createContact':
        return await createContact(event.arguments.input);
      case 'getContact':
        return await getContact(event.arguments.id);
      case 'updateContact':
        return await updateContact(event.arguments.input);
      case 'deleteContact':
        return await deleteContact(event.arguments.id);
      default:
        throw new Error('Unknown field name');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function createContact(input: any) {
  const params = {
    TableName: TABLE_NAME!,
    Item: {
      ...input,
      createdAt: new Date().toISOString()
    }
  };
  await dynamoDB.put(params).promise();
  return params.Item;
}

async function getContact(id: string) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id }
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

async function updateContact(input: any) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id: input.id },
    UpdateExpression: 'set #firstName = :firstName, #lastName = :lastName, #email = :email',
    ExpressionAttributeNames: {
      '#firstName': 'firstName',
      '#lastName': 'lastName',
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':firstName': input.firstName,
      ':lastName': input.lastName,
      ':email': input.email
    },
    ReturnValues: 'ALL_NEW'
  };
  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
}

async function deleteContact(id: string) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id }
  };
  await dynamoDB.delete(params).promise();
  return { id };
}
