import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.USER_PROFILE_TABLE_NAME || "UserProfileTable";

type UserProfile = {
  userId: string;
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: string;
  zipcode: string;
  drinking: string;
  hobbies: string[];
  availability: string[];
  married: string;
  ageRange: string;
  friendAgeRange: string;
  pets: string;
  employed: string;
  work: string;
  political?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    switch (event.httpMethod) {
      case "POST":
        return await createProfile(event);
      case "GET":
        return await getProfile(event);
      case "PUT":
        return await updateProfile(event);
      default:
        return errorResponse(400, "Unsupported HTTP method");
    }
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(500, "Internal server error");
  }
};

async function createProfile(event: APIGatewayEvent) {
  if (!event.body) return errorResponse(400, "Missing request body");

  const profile: UserProfile = JSON.parse(event.body);
  profile.createdAt = new Date().toISOString();
  profile.updatedAt = profile.createdAt;

  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: profile,
    })
  );

  return successResponse(201, profile);
}

async function getProfile(event: APIGatewayEvent) {
  const userId = event.pathParameters?.userId;
  if (!userId) return errorResponse(400, "Missing userId");

  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId },
    })
  );

  if (!result.Item) return errorResponse(404, "Profile not found");
  return successResponse(200, result.Item);
}

async function updateProfile(event: APIGatewayEvent) {
  const userId = event.pathParameters?.userId;
  if (!userId) return errorResponse(400, "Missing userId");

  if (!event.body) return errorResponse(400, "Missing request body");

  const updates: Partial<UserProfile> = JSON.parse(event.body);
  updates.updatedAt = new Date().toISOString();

  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(updates).forEach((key, index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpressionParts.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = updates[key as keyof UserProfile];
  });

  if (updateExpressionParts.length === 0)
    return errorResponse(400, "No valid fields to update");

  await ddbDocClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId },
      UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    })
  );

  return successResponse(200, { message: "Profile updated successfully" });
}

function successResponse(statusCode: number, data: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

function errorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}