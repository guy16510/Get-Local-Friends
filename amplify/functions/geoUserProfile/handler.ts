// amplify/functions/GeoUserProfile/handler.ts
import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { GeoDataManager, GeoDataManagerConfiguration } from "dynamodb-geo";

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = "GeoUserProfileTable";

const geoConfig = new GeoDataManagerConfiguration(ddbDocClient, TABLE_NAME);
geoConfig.hashKeyLength = 3;
const geoDataManager = new GeoDataManager(geoConfig);

type GeoUserProfile = {
  userId: string;
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: boolean;
  zipcode: string;
  drinking: boolean;
  lat: number;
  lng: number;
  hobbies: string[];
  availability: string[];
  married: boolean;
  ageRange: string;
  friendAgeRange: string;
  pets: boolean;
  employed: boolean;
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
        if (event.queryStringParameters?.lat && event.queryStringParameters?.lng) {
          return await getProfilesWithinRadius(event);
        }
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

  const profile: GeoUserProfile = JSON.parse(event.body);

  if (profile.lat === undefined || profile.lng === undefined) {
    return errorResponse(400, "Missing latitude or longitude");
  }

  profile.createdAt = new Date().toISOString();
  profile.updatedAt = profile.createdAt;

  const putPointInput = {
    RangeKeyValue: { S: profile.userId },
    GeoPoint: {
      latitude: profile.lat,
      longitude: profile.lng,
    },
    PutItemInput: {
      TableName: TABLE_NAME,
      Item: profile as any,
    },
  };

  await geoDataManager.putPoint(putPointInput);

  return successResponse(201, profile);
}

async function getProfile(event: APIGatewayEvent) {
  if (!event.queryStringParameters || !event.queryStringParameters.userId) {
    return errorResponse(400, "Missing userId");
  }

  const userId = event.queryStringParameters.userId;

  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId },
      })
    );

    if (!result.Item) {
      return errorResponse(404, "Profile not found");
    }

    return successResponse(200, result.Item);
  } catch (error) {
    console.error("Error getting profile:", error);
    return errorResponse(500, "Error retrieving profile");
  }
}

async function getProfilesWithinRadius(event: APIGatewayEvent) {
  const { lat, lng, distance = "5", unit = "km" } = event.queryStringParameters || {};

  const latitude = parseFloat(lat || "0");
  const longitude = parseFloat(lng || "0");
  const distanceInMeters = unit === "mi" ? parseFloat(distance) * 1609.34 : parseFloat(distance) * 1000;

  try {
    const result = await geoDataManager.queryRadius({
      RadiusInMeter: distanceInMeters,
      CenterPoint: { latitude, longitude },
    });

    return successResponse(200, result);
  } catch (error) {
    console.error("Error getting profiles within radius:", error);
    return errorResponse(500, "Error retrieving profiles");
  }
}

async function updateProfile(event: APIGatewayEvent) {
  if (!event.body) return errorResponse(400, "Missing request body");

  const profile: GeoUserProfile = JSON.parse(event.body);

  if (!profile.userId) {
    return errorResponse(400, "Missing userId");
  }

  profile.updatedAt = new Date().toISOString();

  const updateParams = {
    TableName: TABLE_NAME,
    Key: { userId: profile.userId },
    UpdateExpression: "set #updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#updatedAt": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":updatedAt": profile.updatedAt,
    },
    ReturnValues: "UPDATED_NEW" as const,
  };

  await ddbDocClient.send(new UpdateCommand(updateParams));

  return successResponse(200, profile);
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
