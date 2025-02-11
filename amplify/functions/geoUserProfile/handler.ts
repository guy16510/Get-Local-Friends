import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GeoDataManagerConfiguration, GeoDataManager } from "dynamodb-geo-v3";
import { marshall } from "@aws-sdk/util-dynamodb";

const REGION = "us-east-1";
const TABLE_NAME = "GeoUserProfileTable";
const USERID_GSI_NAME = "userId-index";

interface GeoUserProfile {
  userId?: string;
  lat?: number;
  lng?: number;
  firstName?: string;
  lastName?: string;
  lookingFor?: string[];
  kids?: boolean;
  drinking?: boolean;
  availability?: string[];
  married?: boolean;
  ageRange?: string;
  friendAgeRange?: string;
  pets?: boolean;
  employed?: boolean;
  work?: string;
  political?: string;
  createdAt?: string;
  updatedAt?: string;
  hashKey?: number;
  rangeKey?: string;
}

const rawClient = new DynamoDB({ region: REGION });
const ddbDocClient = DynamoDBDocumentClient.from(rawClient);

const geoConfig = new GeoDataManagerConfiguration(rawClient as any, TABLE_NAME);
geoConfig.hashKeyLength = 3;
const geoDataManager = new GeoDataManager(geoConfig);

// Lambda Handler
export const handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        return await createProfile(event);
      case "GET":
        return event.queryStringParameters?.lat && event.queryStringParameters?.lng
          ? await getProfilesWithinRadius(event)
          : await getProfile(event);
      case "PUT":
        return await updateProfile(event);
      default:
        return errorResponse(400, `Unsupported method: ${event.httpMethod}`);
    }
  } catch (err) {
    console.error("Handler error:", err);
    return errorResponse(500, "Internal server error");
  }
};

// Create Profile
async function createProfile(event: APIGatewayEvent) {
  if (!event.body) return errorResponse(400, "Missing request body");

  const profile: GeoUserProfile = JSON.parse(event.body);
  console.log("API invoked...")
  if (!profile.userId) return errorResponse(400, "Missing userId");
  if (profile.lat === undefined || profile.lng === undefined)
    return errorResponse(400, "Missing lat/lng");

  const now = new Date().toISOString();
  profile.createdAt = now;
  profile.updatedAt = now;

  await geoDataManager.putPoint({
    RangeKeyValue: { S: profile.userId },
    GeoPoint: { latitude: profile.lat, longitude: profile.lng },
    PutItemInput: { Item: marshall(profile) },
  });

  const queryInput = {
    TableName: TABLE_NAME,
    IndexName: USERID_GSI_NAME,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: { ":uid": { S: profile.userId } },
    Limit: 1,
  };
  console.log("queryInput:" + queryInput);

  const result = await ddbDocClient.send(new QueryCommand(queryInput));
  if (!result.Items || result.Items.length === 0)
    return errorResponse(500, "Failed to retrieve profile after creation.");

  const item = result.Items[0];
  console.log("item submitted:" + item);

  const enrichedProfile = {
    ...profile,
    hashKey: item.hashKey?.N ? parseFloat(item.hashKey.N) : null,
    rangeKey: item.rangeKey?.S || profile.userId,
  };
  console.log("enrichedProfile" + enrichedProfile)
  return successResponse(201, { message: "Profile created", profile: enrichedProfile });
}

// Get Profile by userId
async function getProfile(event: APIGatewayEvent) {
  const userId = event.queryStringParameters?.userId;
  if (!userId) return errorResponse(400, "Missing userId");

  const queryInput = {
    TableName: TABLE_NAME,
    IndexName: USERID_GSI_NAME,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: { ":uid": { S: userId } },
    Limit: 1,
  };

  try {
    const result = await ddbDocClient.send(new QueryCommand(queryInput));
    if (!result.Items || result.Items.length === 0)
      return errorResponse(404, `Profile not found for userId=${userId}`);
    return successResponse(200, result.Items[0]);
  } catch (error) {
    console.error("Error in getProfile:", error);
    return errorResponse(500, "Error retrieving profile by userId");
  }
}

// Get Profiles Within a Radius
async function getProfilesWithinRadius(event: APIGatewayEvent) {
  const { lat, lng, distance = "5", unit = "km" } = event.queryStringParameters || {};

  const latitude = parseFloat(lat || "0");
  const longitude = parseFloat(lng || "0");
  const distanceInMeters = unit === "mi"
    ? parseFloat(distance) * 1609.34
    : parseFloat(distance) * 1000;

  try {
    const result = await geoDataManager.queryRadius({
      RadiusInMeter: distanceInMeters,
      CenterPoint: { latitude, longitude },
    });

    return successResponse(200, result);
  } catch (error) {
    console.error("Error in getProfilesWithinRadius:", error);
    return errorResponse(500, "Error retrieving nearby profiles");
  }
}

// Update Profile
async function updateProfile(event: APIGatewayEvent) {
  if (!event.body) return errorResponse(400, "Missing request body");

  const updates: GeoUserProfile = JSON.parse(event.body);
  if (!updates.userId) return errorResponse(400, "Missing userId");
  if (updates.lat === undefined || updates.lng === undefined)
    return errorResponse(400, "Missing lat/lng");

  const now = new Date().toISOString();
  updates.updatedAt = now;

  await geoDataManager.updatePoint({
    RangeKeyValue: { S: updates.userId },
    GeoPoint: { latitude: updates.lat, longitude: updates.lng },
    UpdateItemInput: {
      TableName: TABLE_NAME,
      Key: {},
      UpdateExpression: "SET updatedAt = :updatedAt",
      ExpressionAttributeValues: { ":updatedAt": { S: now } },
      ReturnValues: "ALL_NEW",
    },
  });

  return successResponse(200, { message: "Profile updated", updatedProfile: updates });
}

// Response Helpers
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