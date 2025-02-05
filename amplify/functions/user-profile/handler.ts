import { type Schema } from "../../data/user-profile";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.USER_PROFILE_TABLE_NAME;

type UserProfile = {
  userId: string;
  isSmoker: boolean;
  isDrinker: boolean;
  hasPets: boolean;
  married: boolean;
  hasChildren: boolean;
  relationshipStatus: string;
  isInterestedIn: string;
};

export const handler = async (event: any) => {
  try {
    switch (event.requestContext.http.method) {
      case 'POST':
        return await createProfile(event);
      case 'GET':
        return await getProfile(event);
      case 'PUT':
        return await updateProfile(event);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Unsupported method' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

async function createProfile(event: any) {
  const profile: UserProfile = JSON.parse(event.body);
  const item = {
    ...profile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await ddbDocClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return {
    statusCode: 201,
    body: JSON.stringify(item)
  };
}

async function getProfile(event: any) {
  const userId = event.pathParameters?.userId;

  const result = await ddbDocClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId }
  }));

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Profile not found' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
}

async function updateProfile(event: any) {
  const userId = event.pathParameters?.userId;
  const updates: Partial<UserProfile> = JSON.parse(event.body);
  
  const updateExpression = Object.keys(updates)
    .map((key, index) => `#field${index} = :value${index}`)
    .join(', ');

  const expressionAttributeNames = Object.keys(updates)
    .reduce((acc, key, index) => ({
      ...acc,
      [`#field${index}`]: key
    }), {});

  const expressionAttributeValues = Object.entries(updates)
    .reduce((acc, [key, value], index) => ({
      ...acc,
      [`:value${index}`]: value
    }), {});

  await ddbDocClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: `SET ${updateExpression}, updatedAt = :updatedAt`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: {
      ...expressionAttributeValues,
      ':updatedAt': new Date().toISOString()
    }
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Profile updated successfully' })
  };
}