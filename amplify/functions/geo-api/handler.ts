import { type AppSyncResolverHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.GEO_TABLE_NAME;

export const handler: AppSyncResolverHandler<any, any> = async (event) => {
  try {
    switch (event.info.fieldName) {
      case 'createLocation':
        return await createLocation(event.arguments.input);
      case 'getLocation':
        return await getLocation(event.arguments.id);
      case 'updateLocation':
        return await updateLocation(event.arguments.input);
      case 'deleteLocation':
        return await deleteLocation(event.arguments.id);
      default:
        throw new Error('Unknown field name');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function createLocation(input: any) {
  const params = {
    TableName: TABLE_NAME!,
    Item: {
      ...input,
      timestamp: new Date().toISOString()
    }
  };
  await dynamoDB.put(params).promise();
  return params.Item;
}

async function getLocation(id: string) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id }
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

async function updateLocation(input: any) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id: input.id },
    UpdateExpression: 'set #latitude = :latitude, #longitude = :longitude',
    ExpressionAttributeNames: {
      '#latitude': 'latitude',
      '#longitude': 'longitude'
    },
    ExpressionAttributeValues: {
      ':latitude': input.latitude,
      ':longitude': input.longitude
    },
    ReturnValues: 'ALL_NEW'
  };
  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
}

async function deleteLocation(id: string) {
  const params = {
    TableName: TABLE_NAME!,
    Key: { id }
  };
  await dynamoDB.delete(params).promise();
  return { id };
}
