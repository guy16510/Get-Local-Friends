import { type AppSyncResolverHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CHAT_TABLE_NAME;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
  try {
    switch (event.info.fieldName) {
      case 'createChat':
        return await createChat(event.arguments.input);
      case 'getChat':
        return await getChat(event.arguments.id);
      case 'updateChat':
        return await updateChat(event.arguments.input);
      case 'deleteChat':
        return await deleteChat(event.arguments.id);
      default:
        throw new Error('Unknown field name');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function createChat(input: any) {
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

async function getChat(id: string) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id }
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

async function updateChat(input: any) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id: input.id },
    UpdateExpression: 'set #status = :status, #message = :message',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#message': 'message'
    },
    ExpressionAttributeValues: {
      ':status': input.status,
      ':message': input.message
    },
    ReturnValues: 'ALL_NEW'
  };
  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
}

async function deleteChat(id: string) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id }
  };
  await dynamoDB.delete(params).promise();
  return { id };
}
